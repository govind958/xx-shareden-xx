import type { OrderWithStacks, BillingAddress } from "@/src/types/billing";

function fmtDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function buildInvoiceHTML(
  order: OrderWithStacks,
  billingAddress?: BillingAddress | null
): string {
  const addressLines: string[] = [];
  if (billingAddress) {
    if (billingAddress.company_name) addressLines.push(billingAddress.company_name);
    if (billingAddress.street_address) addressLines.push(billingAddress.street_address);
    const cityLine = [billingAddress.city, billingAddress.state, billingAddress.zip_code].filter(Boolean).join(", ");
    if (cityLine) addressLines.push(cityLine);
    if (billingAddress.country) addressLines.push(billingAddress.country);
    if (billingAddress.phone) addressLines.push("Phone: " + billingAddress.phone);
  }

  let rowNum = 0;
  const itemRows = order.stacks
    .flatMap((stack) => {
      const hasSubStacks = stack.sub_stacks && stack.sub_stacks.length > 0;
      const rows: string[] = [];

      if (hasSubStacks) {
        rows.push(`
          <tr>
            <td style="padding:14px 16px; border-bottom:1px solid #eef2f7; color:#64748b; font-size:13px; text-align:center; width:40px;">${++rowNum}</td>
            <td style="padding:14px 16px; border-bottom:1px solid #eef2f7; color:#0f172a; font-weight:600; font-size:13px;">${stack.stack_name}</td>
            <td style="padding:14px 16px; border-bottom:1px solid #eef2f7; color:#64748b; font-size:13px;">${stack.stack_type ?? "\u2014"}</td>
          </tr>`);
        for (const sub of stack.sub_stacks!) {
          rows.push(`
          <tr>
            <td style="padding:10px 16px; border-bottom:1px solid #eef2f7; color:#64748b; font-size:13px; text-align:center; width:40px;"></td>
            <td style="padding:10px 16px; border-bottom:1px solid #eef2f7; color:#475569; font-size:12px; padding-left:28px;">↳ ${sub.name}</td>
            <td style="padding:10px 16px; border-bottom:1px solid #eef2f7; color:#64748b; font-size:12px;">Add-on</td>
          </tr>`);
        }
      } else {
        rows.push(`
          <tr>
            <td style="padding:14px 16px; border-bottom:1px solid #eef2f7; color:#64748b; font-size:13px; text-align:center; width:40px;">${++rowNum}</td>
            <td style="padding:14px 16px; border-bottom:1px solid #eef2f7; color:#0f172a; font-weight:600; font-size:13px;">${stack.stack_name}</td>
            <td style="padding:14px 16px; border-bottom:1px solid #eef2f7; color:#64748b; font-size:13px;">${stack.stack_type ?? "\u2014"}</td>
          </tr>`);
      }
      return rows;
    })
    .join("");

  return `
<div id="invoice-root" style="width:700px; padding:48px 52px; font-family: Arial, Helvetica, sans-serif; color:#1e293b; background:#ffffff; box-sizing:border-box;">

  <!-- ===== HEADER ===== -->
  <table style="width:100%; margin-bottom:36px;" cellpadding="0" cellspacing="0">
    <tr>
      <td style="vertical-align:top; width:60%;">
        <div style="font-size:26px; font-weight:800; letter-spacing:-0.5px; color:#0f172a; margin-bottom:14px;">SHAREDEN</div>
        <div style="font-size:12px; color:#64748b; line-height:1.7;">
          GSTIN: 29ABCDE1234F1Z5<br>
          100 Tech Park Avenue, Koramangala<br>
          Bengaluru, Karnataka 560034, India<br>
          support@shareden.com
        </div>
      </td>
      <td style="vertical-align:top; text-align:right; width:40%;">
        <div style="font-size:32px; font-weight:800; color:#e2e8f0; letter-spacing:2px; margin-bottom:8px;">INVOICE</div>
        <div style="font-size:16px; font-weight:700; color:#0f172a; margin-bottom:14px;">#${order.id.substring(0, 8).toUpperCase()}</div>
        <table cellpadding="0" cellspacing="0" style="margin-left:auto;">
          <tr>
            <td style="background:#ecfdf5; color:#059669; border:1px solid #a7f3d0; padding:4px 14px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; text-align:center;">PAID</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <div style="border-top:2px solid #0f172a; margin-bottom:32px;"></div>

  <!-- ===== META ===== -->
  <table style="width:100%; background:#f8fafc; border:1px solid #eef2f7; margin-bottom:32px;" cellpadding="0" cellspacing="0">
    <tr>
      <td style="padding:20px 24px; width:33.33%; vertical-align:top;">
        <div style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1.2px; color:#64748b; margin-bottom:6px;">Invoice Date</div>
        <div style="font-weight:600; color:#0f172a; font-size:14px;">${fmtDate(order.created_at)}</div>
      </td>
      <td style="padding:20px 24px; width:33.33%; vertical-align:top; border-left:1px solid #eef2f7; border-right:1px solid #eef2f7;">
        <div style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1.2px; color:#64748b; margin-bottom:6px;">Payment Method</div>
        <div style="font-weight:600; color:#0f172a; font-size:14px;">${order.payment_method ?? "razorpay"}</div>
      </td>
      <td style="padding:20px 24px; width:33.33%; vertical-align:top;">
        <div style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1.2px; color:#64748b; margin-bottom:6px;">Transaction ID</div>
        <div style="font-weight:600; color:#0f172a; font-size:13px; word-break:break-all;">${order.payment_id ?? "\u2014"}</div>
      </td>
    </tr>
  </table>

  <!-- ===== BILL TO ===== -->
  ${addressLines.length > 0 ? `
  <div style="margin-bottom:32px;">
    <div style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1.2px; color:#94a3b8; margin-bottom:10px;">Billed To</div>
    <div style="font-size:13px; color:#475569; line-height:1.7;">
      <div style="font-weight:700; color:#0f172a; font-size:14px; margin-bottom:2px;">${addressLines[0]}</div>
      ${addressLines.slice(1).map(l => `<div>${l}</div>`).join("")}
    </div>
  </div>
  ` : ""}

  <!-- ===== ITEMS TABLE ===== -->
  <table style="width:100%; border-collapse:collapse; margin-bottom:32px;" cellpadding="0" cellspacing="0">
    <tr style="background:#f8fafc;">
      <th style="padding:12px 16px; text-align:center; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#64748b; border-top:1px solid #e2e8f0; border-bottom:1px solid #e2e8f0; width:40px;">#</th>
      <th style="padding:12px 16px; text-align:left; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#64748b; border-top:1px solid #e2e8f0; border-bottom:1px solid #e2e8f0;">Description</th>
      <th style="padding:12px 16px; text-align:left; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#64748b; border-top:1px solid #e2e8f0; border-bottom:1px solid #e2e8f0;">Type</th>
    </tr>
    ${itemRows}
  </table>

  <!-- ===== FOOTER ===== -->
  <table style="width:100%; border-top:1px solid #e2e8f0; padding-top:20px;" cellpadding="0" cellspacing="0">
    <tr>
      <td style="vertical-align:top; padding-top:20px; width:50%;">
        <div style="font-size:12px; font-weight:600; color:#475569; margin-bottom:4px;">Subscription Terms:</div>
        <div style="font-size:12px; color:#94a3b8; line-height:1.5;">
          ${order.is_recurring
            ? `Recurring: ${order.subscription_duration ?? "Standard"} (Auto-renews)`
            : "One-time purchase. No recurring charges."}
        </div>
      </td>
      <td style="vertical-align:top; text-align:right; padding-top:20px; width:50%;">
        <div style="font-size:12px; font-weight:600; color:#0f172a; margin-bottom:4px;">Thank you for choosing Shareden!</div>
        <div style="font-size:12px; color:#94a3b8;">This is a computer-generated document.</div>
      </td>
    </tr>
  </table>

</div>
  `;
}

export function generateInvoice(
  order: OrderWithStacks,
  billingAddress?: BillingAddress | null
) {
  const html = buildInvoiceHTML(order, billingAddress);

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice #${order.id.substring(0, 8).toUpperCase()}</title>
      <style>
        @media print {
          body { margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { size: A4; margin: 10mm; }
        }
      </style>
    </head>
    <body>${html}</body>
    </html>
  `);
  printWindow.document.close();
  printWindow.onload = () => printWindow.print();
}
