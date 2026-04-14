function runDailyDigest() {
  const apiKey = PropertiesService.getScriptProperties().getProperty('ANTHROPIC_API_KEY');
  const userEmail = 'douglascch@gmail.com';

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', weekday: 'short' });
  const subject = `☀️ Your Daily Digest - ${dateStr}`;

  const prompt = `You are a Geopolitical & Policy Analyst acting as Chief of Staff for Doug — 33, Fintech Product Manager in London, £1M portfolio, HK-born, global ambitions.

# Objective
Deliver a 1-minute briefing focused on: Fintech career, Portfolio Macro, and London living and working.

# Sources & Search Strategy
Perform a maximum of 4 web searches total. Be selective. Use this tiered approach:
1. PRIMARY: JP Morgan Private Bank (https://privatebank.jpmorgan.com/nam/en/home), MarketWatch, CNBC, The Guardian, South China Morning Post, Al Jazeera.
2. AGGREGATORS: Search "FT reports today" or "Reuters says today" on Yahoo Finance and Google News.
3. DATA: LSEG and gov.uk for raw policy/market data.

# Search for today's date regarding:
- "UK mortgage rate forecasts and London property trends"
- "UK/EU Fintech regulatory updates on AI, consumer acts, and operational regulations"
- "Global trade/geopolitical risks affecting S&P 500 & FTSE 100"
- "UK policy changes that would impact my quality of life in London (Childcare, Tax, Stamp Duty)"

# Output format — return raw HTML only. No markdown, no code fences, no backticks, no preamble. Start your response with <!DOCTYPE html> directly.

1. First element inside <body>: <div style="display:none;max-height:0;overflow:hidden;">YOUR 10-WORD VIBE SUMMARY</div>
2. Header bar: h1 "⚡️ Bom dia, Senhor Doug." with h2 beneath it — the <10-word vibe summary, lighter weight
3. Market tiles row: current prices for S&P 500, TNX (10Y yield), Gold, VIX — each as a separate styled tile
4. Four paragraphs — 4 sentences maximum each, no exceptions:
   - Para 1: Capital Markets — major investment and wealth movements
   - Para 2: Fintech Trends & Employment — critical industry shifts
   - Para 3: London & Life — property and lifestyle triggers
   - Para 4: What's Cool — one light-hearted global win or innovation
   Each paragraph ends with a "What this means for you:" callout box.
5. Sources section: list every source used as a working hyperlink. This section is mandatory — do not omit it.
6. Footer line: "This daily digest is summarised by AI using Claude claude-sonnet-4-6 and Google Apps Script."

# Style — all CSS must be inline, Gmail strips external stylesheets
- Outer wrapper: style="background-color:#ffffff;max-width:620px;margin:0 auto;font-family:'Playfair Display',serif;"
- Header bar: style="background-color:#D4651B;padding:28px 32px;" — always orange, Gmail never inverts this
- h1: style="font-size:32px;font-weight:700;color:#ffffff;font-family:'Playfair Display',serif;margin:0 0 8px 0;"
- h2: style="font-size:16px;font-weight:400;color:rgba(255,255,255,0.88);font-family:'Playfair Display',serif;margin:0;font-style:italic;"
- Body wrapper: style="background-color:#f7f6f3;padding:16px 24px;"
- Section headings: style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#D4651B;font-family:sans-serif;font-weight:600;border-bottom:1px solid #e5e5ea;padding-bottom:6px;margin:20px 0 10px 0;"
- Body paragraphs: style="font-size:14px;line-height:1.8;color:#3a3a3c;font-family:'Playfair Display',serif;" — MAX 4 SENTENCES
- Market tiles: a div with style="display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:16px;background-color:#f7f6f3;"
  Each tile: style="background-color:#ffffff;border:1px solid #e5e5ea;border-radius:8px;padding:14px 12px;text-align:center;"
  Tile label: style="font-size:9px;color:#8e8e93;text-transform:uppercase;letter-spacing:0.08em;font-family:sans-serif;margin-bottom:6px;"
  Tile value: style="font-size:18px;font-weight:700;font-family:'Playfair Display',serif;margin-bottom:3px;color:#1c1c1e;"
  Tile change: style="font-size:10px;font-family:sans-serif;" — #34c759 if positive, #ff3b30 if negative
- Callout boxes: style="background-color:#fff3ec;border-left:3px solid #D4651B;padding:12px 16px;margin-top:12px;"
  Label: style="font-size:9px;color:#D4651B;text-transform:uppercase;letter-spacing:0.07em;font-family:sans-serif;margin-bottom:5px;"
  Text: style="font-size:13px;font-weight:600;color:#1c1c1e;font-family:sans-serif;line-height:1.5;" — MAX 2 SENTENCES
- Sources: style="padding:12px 24px;border-top:1px solid #e5e5ea;background-color:#f7f6f3;"
  Label: style="font-size:9px;color:#8e8e93;text-transform:uppercase;letter-spacing:0.06em;font-family:sans-serif;margin-bottom:4px;"
  Links: style="font-size:10px;color:#D4651B;font-family:sans-serif;line-height:1.8;" — every source as a working hyperlink, mandatory
- Footer: style="padding:8px 24px 20px;background-color:#f7f6f3;"
  Text: style="font-size:9px;color:#aeaeb2;font-family:sans-serif;font-style:italic;"
  Content: "This daily digest is summarised by AI using Claude claude-sonnet-4-6 and Google Apps Script."
- Include <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet"> in <head>
- Executive, high-signal, no fluff

  const response = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    payload: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages: [{ role: 'user', content: prompt }]
    })
  });

  const data = JSON.parse(response.getContentText());
  const html = data.content.filter(b => b.type === 'text').map(b => b.text).join('');

  GmailApp.sendEmail(userEmail, subject, '', { htmlBody: html });
  Logger.log('Digest sent: ' + subject);
}

function setDailyTrigger() {
  ScriptApp.newTrigger('runHorizonScan')
    .timeBased()
    .everyDays(1)
    .atHour(6)
    .nearMinute(30)
    .create();
}