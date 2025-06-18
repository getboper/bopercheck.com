import { Request, Response } from 'express';
import { db } from './db';
import { outreachLogs } from '@shared/schema';
import { eq } from 'drizzle-orm';

// SendGrid webhook handler for real-time email delivery tracking
export async function handleSendGridWebhook(req: Request, res: Response) {
  try {
    const events = req.body;
    
    if (!Array.isArray(events)) {
      return res.status(400).json({ error: 'Invalid webhook payload' });
    }

    for (const event of events) {
      const { sg_message_id, event: eventType, timestamp, reason, url, useragent, ip } = event;
      
      if (!sg_message_id) continue;

      // Find outreach log by SendGrid message ID
      const outreachRecord = await db.select()
        .from(outreachLogs)
        .where(eq(outreachLogs.sendgridMessageId, sg_message_id))
        .limit(1);

      if (outreachRecord.length === 0) continue;

      const record = outreachRecord[0];
      const updateData: any = { updatedAt: new Date() };

      switch (eventType) {
        case 'delivered':
          updateData.deliveryStatus = 'delivered';
          updateData.deliveredAt = new Date(timestamp * 1000);
          updateData.emailStatus = 'delivered';
          break;
          
        case 'open':
          updateData.openedAt = new Date(timestamp * 1000);
          if (updateData.deliveryStatus === 'sent') {
            updateData.deliveryStatus = 'opened';
          }
          break;
          
        case 'click':
          updateData.clickedAt = new Date(timestamp * 1000);
          updateData.lastClickedAt = new Date(timestamp * 1000);
          updateData.clickCount = (record.clickCount || 0) + 1;
          updateData.visitedSite = true;
          if (useragent) updateData.userAgent = useragent;
          if (ip) updateData.ipAddress = ip;
          break;
          
        case 'bounce':
        case 'blocked':
        case 'dropped':
          updateData.deliveryStatus = 'bounced';
          updateData.emailStatus = 'bounced';
          if (reason) updateData.bounceReason = reason;
          break;
          
        case 'unsubscribe':
          updateData.unsubscribedAt = new Date(timestamp * 1000);
          updateData.deliveryStatus = 'unsubscribed';
          break;
          
        case 'spamreport':
          updateData.deliveryStatus = 'spam';
          updateData.emailStatus = 'spam';
          break;
      }

      // Update the outreach log with new tracking data
      await db.update(outreachLogs)
        .set(updateData)
        .where(eq(outreachLogs.id, record.id));

      console.log(`SendGrid webhook processed: ${eventType} for message ${sg_message_id}`);
    }

    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('SendGrid webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

// Generate tracking URLs for outreach emails
export function generateTrackingUrl(outreachId: string, originalUrl: string): string {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://bopercheck.replit.app' 
    : 'http://localhost:5000';
  
  return `${baseUrl}/track/click/${outreachId}?url=${encodeURIComponent(originalUrl)}`;
}

// Handle click tracking
export async function handleClickTracking(req: Request, res: Response) {
  try {
    const { outreachId } = req.params;
    const { url } = req.query;
    const userAgent = req.get('User-Agent');
    const ipAddress = req.ip || req.connection.remoteAddress;

    if (!outreachId || !url) {
      return res.status(400).json({ error: 'Missing tracking parameters' });
    }

    // Update click tracking in database
    const updateData = {
      clickedAt: new Date(),
      lastClickedAt: new Date(),
      visitedSite: true,
      userAgent: userAgent || null,
      ipAddress: ipAddress || null,
      updatedAt: new Date()
    };

    // Get current click count and increment
    const currentRecord = await db.select()
      .from(outreachLogs)
      .where(eq(outreachLogs.id, outreachId))
      .limit(1);

    const currentClickCount = currentRecord[0]?.clickCount || 0;
    
    await db.update(outreachLogs)
      .set({
        ...updateData,
        clickCount: currentClickCount + 1
      })
      .where(eq(outreachLogs.id, outreachId));

    console.log(`Click tracked for outreach ${outreachId}: ${url}`);

    // Redirect to original URL
    res.redirect(decodeURIComponent(url as string));
  } catch (error) {
    console.error('Click tracking error:', error);
    res.status(500).json({ error: 'Click tracking failed' });
  }
}