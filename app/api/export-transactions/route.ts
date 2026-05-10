import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { getAllTransactions, getUserRole } from '@/lib/supabase/queries';

export async function GET(request: Request) {
  try {
    const role = await getUserRole();
    if (role !== "admin" && role !== "superadmin") {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const date = searchParams.get('date') || '';
    const type = searchParams.get('type') || '';
    const clientId = searchParams.get('client_id') || '';

    const allTransactions = await getAllTransactions();
    let transactions = allTransactions;
    
    if (query) {
      const q = query.toLowerCase();
      transactions = transactions.filter(t => 
        t.clients.name.toLowerCase().includes(q) || 
        (t.users?.full_name || "").toLowerCase().includes(q) ||
        (t.description || "").toLowerCase().includes(q)
      );
    }
    
    if (date) {
      transactions = transactions.filter(t => t.date === date);
    }

    if (type && (type === 'payment' || type === 'expense')) {
      transactions = transactions.filter(t => t.type === type);
    }

    if (clientId) {
      transactions = transactions.filter(t => t.client_id === clientId);
    }

    // Determine total income, expense, and profit for the report
    let totalIncome = 0;
    let totalExpense = 0;
    
    // We calculate profit by summing the profit of unique clients in this report
    let totalProfit = 0;
    const uniqueClientIds = new Set();
    
    transactions.forEach(t => {
      if (t.type === 'payment') totalIncome += Number(t.amount);
      if (t.type === 'expense') totalExpense += Number(t.amount);
      
      if (role === 'superadmin' && t.client_id) {
        if (!uniqueClientIds.has(t.client_id)) {
          uniqueClientIds.add(t.client_id);
          const clientProfit = t.clients?.profit || 0;
          totalProfit += Number(clientProfit);
        }
      }
    });

    // If superadmin, profit decreases the totals
    if (role === 'superadmin') {
      totalIncome = Math.max(0, totalIncome - totalProfit);
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Transactions Report</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
            color: #333;
            margin: 0;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #eaeaea;
          }
          h1 { margin: 0 0 10px 0; color: #111; }
          .meta { color: #666; font-size: 14px; }
          .summary {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
          }
          .summary-item {
            text-align: center;
          }
          .summary-label {
            font-size: 12px;
            text-transform: uppercase;
            color: #6b7280;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .summary-value {
            font-size: 20px;
            font-weight: bold;
          }
          .summary-value.income { color: #059669; }
          .summary-value.expense { color: #dc2626; }
          .summary-value.net { color: #111827; }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            font-size: 14px;
          }
          th { 
            background-color: #f3f4f6; 
            color: #374151;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 12px;
            padding: 12px 8px;
            text-align: left;
            border-bottom: 2px solid #e5e7eb;
          }
          td { 
            padding: 12px 8px; 
            border-bottom: 1px solid #e5e7eb;
            color: #4b5563;
          }
          .payment { color: #059669; font-weight: 500; }
          .expense { color: #dc2626; font-weight: 500; }
          .text-right { text-align: right; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${clientId && transactions.length > 0 ? `${transactions[0].clients.name} - Transactions Report` : 'Transactions Report'}</h1>
          <div class="meta">Generated on: ${new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</div>
        </div>
        
        <div class="summary">
          <div class="summary-item">
            <div class="summary-label">Total Income</div>
            <div class="summary-value income">+${totalIncome.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>
          </div>
          ${role === 'superadmin' ? `
          <div class="summary-item">
            <div class="summary-label">Total Profit</div>
            <div class="summary-value income">${totalProfit.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>
          </div>
          ` : ''}
          <div class="summary-item">
            <div class="summary-label">Total Expense</div>
            <div class="summary-value expense">-${totalExpense.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Net Balance</div>
            <div class="summary-value net">${(totalIncome - totalExpense).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Total Transactions</div>
            <div class="summary-value net">${transactions.length}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Client</th>
              <th>Type</th>
              <th>Description</th>
              <th class="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${transactions.map(t => `
              <tr>
                <td>${t.date}</td>
                <td>${t.clients.name}</td>
                <td>${t.type.charAt(0).toUpperCase() + t.type.slice(1)}</td>
                <td>${t.description}</td>
                <td class="text-right ${t.type === 'payment' ? 'payment' : 'expense'}">
                  ${t.type === 'payment' ? '+' : '-'}${Number(t.amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </td>
              </tr>
            `).join('')}
            ${transactions.length === 0 ? '<tr><td colspan="5" style="text-align: center; padding: 20px;">No transactions found</td></tr>' : ''}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    // A professional dummy scale logo in base64 SVG
    const dummyLogoSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23111827" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>';
    const dummyLogoUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(dummyLogoSvg)}`;

    // Header and footer templates for Puppeteer
    const headerTemplate = `
      <div style="font-size: 10px; font-family: sans-serif; width: 100%; padding: 0 40px; display: flex; justify-content: space-between; align-items: center; color: #6b7280; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <img src="${dummyLogoUrl}" style="width: 24px; height: 24px;" alt="Logo" />
          <span style="font-weight: 600; color: #111827; font-size: 12px;">Law Firm System</span>
        </div>
        <div>
          <span>Confidential Report</span>
        </div>
      </div>
    `;

    const footerTemplate = `
      <div style="font-size: 9px; font-family: sans-serif; width: 100%; padding: 0 40px; display: flex; justify-content: space-between; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 10px;">
        <span>Generated on: ${new Date().toLocaleDateString()}</span>
        <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
      </div>
    `;

    const pdfBuffer = await page.pdf({ 
      format: 'A4', 
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate,
      footerTemplate,
      margin: { top: '80px', right: '40px', bottom: '80px', left: '40px' }
    });
    await browser.close();

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="transactions_report.pdf"',
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return new NextResponse('Error generating PDF', { status: 500 });
  }
}
