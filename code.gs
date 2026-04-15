function runDailyDigest() {
  const apiKey = PropertiesService.getScriptProperties().getProperty('ANTHROPIC_API_KEY');
  const userEmail = 'douglascch@gmail.com';

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', weekday: 'short' });
  const subject = `☀️ Your Daily Digest - ${dateStr}`;

  // STYLING TEMPLATE
  const template = `<!DOCTYPE html>
<html>
<head></head>
<body style="margin:0;padding:0;background:#141413;font-family:sans-serif;color:#e0e0e0;">
  <div style="display:none;max-height:0;overflow:hidden;">{{PREHEADER}}</div>
  <div style="background:#D4651B;padding:24px 32px;">
    <h1 style="margin:0;color:#fff;font-size:24px;">⚡️ Bom dia, Senhor Doug.</h1>
    <h2 style="margin:8px 0 0;color:#fff;font-weight:300;font-size:14px;">{{VIBE_SUMMARY}}</h2>
  </div>
  <div style="display:flex;gap:12px;padding:24px 32px;background:#1a1a1a;">
    <div style="flex:1;background:#1e3a2f;border-radius:8px;padding:16px;text-align:center;">
      <div style="color:#888;font-size:11px;">S&P 500</div>
      <div style="color:#4caf50;font-size:22px;font-weight:700;">{{SP500}}</div>
      <div style="color:#4caf50;font-size:12px;">{{SP500_CHANGE}}</div>
    </div>
    <div style="flex:1;background:#2a1f1a;border-radius:8px;padding:16px;text-align:center;">
      <div style="color:#888;font-size:11px;">TNX 10Y</div>
      <div style="color:#ff9800;font-size:22px;font-weight:700;">{{TNX}}</div>
      <div style="color:#ff9800;font-size:12px;">{{TNX_CHANGE}}</div>
    </div>
    <div style="flex:1;background:#2a2a1a;border-radius:8px;padding:16px;text-align:center;">
      <div style="color:#888;font-size:11px;">Gold</div>
      <div style="color:#ffc107;font-size:22px;font-weight:700;">{{GOLD}}</div>
      <div style="color:#ffc107;font-size:12px;">{{GOLD_CHANGE}}</div>
    </div>
    <div style="flex:1;background:#1a1f2a;border-radius:8px;padding:16px;text-align:center;">
      <div style="color:#888;font-size:11px;">VIX</div>
      <div style="color:#64b5f6;font-size:22px;font-weight:700;">{{VIX}}</div>
      <div style="color:#64b5f6;font-size:12px;">{{VIX_CHANGE}}</div>
    </div>
  </div>
  <div style="padding:0 32px 32px;">
    <h3 style="color:#D4651B;border-bottom:1px solid #333;padding-bottom:8px;">📈 Capital Markets</h3>
    <p style="line-height:1.7;font-size:14px;">{{CAPITAL_MARKETS}}</p>
    <p style="font-size:14px;"><strong style="color:#D4651B;">What this means for you:</strong> {{ACTION_1}}</p>
    <h3 style="color:#D4651B;border-bottom:1px solid #333;padding-bottom:8px;">💻 Fintech Trends & Employment</h3>
    <p style="line-height:1.7;font-size:14px;">{{FINTECH}}</p>
    <p style="font-size:14px;"><strong style="color:#D4651B;">What this means for you:</strong> {{ACTION_2}}</p>
    <h3 style="color:#D4651B;border-bottom:1px solid #333;padding-bottom:8px;">🏙️ London & Life</h3>
    <p style="line-height:1.7;font-size:14px;">{{LONDON}}</p>
    <p style="font-size:14px;"><strong style="color:#D4651B;">What this means for you:</strong> {{ACTION_3}}</p>
    <h3 style="color:#D4651B;border-bottom:1px solid #333;padding-bottom:8px;">🎲 What's Cool</h3>
    <p style="line-height:1.7;font-size:14px;">{{COOL}}</p>
  </div>
  <div style="padding:16px 32px;background:#1a1a1a;font-size:12px;color:#666;">
    <strong>Sources:</strong> {{SOURCES}}
  </div>
</body>
</html>`;

  const prompt = `You are a Geopolitical & Finance Analyst acting as Chief of Staff for Doug — 33 years old, Fintech Product Manager in London, £1M portfolio, HK-born, global ambitions.

# Objective
Deliver a daily news digest in a short email focused on: Fintech career, Portfolio Macro, and London living and working.

# Sources & Search Strategy
Perform a maximum of 4 web searches total. Be selective. Use this tiered approach:
1. PRIMARY: JP Morgan Private Bank, MarketWatch, South China Morning Post, Al Jazeera.
2. AGGREGATORS: Search "FT reports today" or "Reuters says today" on Yahoo Finance and Google News.
3. DATA: LSEG, OBR, ONS, Bank of Engalnd, gov.uk for raw policy/market data.

# Search for today's date regarding:
- "UK mortgage rate forecasts and London property trends"
- "UK/EU Fintech regulatory updates on AI, consumer acts, and operational regulations"
- "Global trade/geopolitical risks affecting S&P 500 & FTSE 100"
- "UK policy changes that would impact my quality of life in London (Childcare, Tax, Stamp Duty)"

# Output format
CRITICAL: Return raw HTML only. No markdown, no code fences, no backticks, no preamble. Your response must begin with <!DOCTYPE html> and nothing before it.

Structure the HTML exactly as follows:

1. <head> must contain:
   - <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet">
   - <meta name="color-scheme" content="dark light">

2. First element inside <body>:
   <div style="display:none;max-height:0;overflow:hidden;">YOUR 10-WORD VIBE SUMMARY</div>

3. Header bar div with style="background-color:#D4651B;padding:28px 32px;":
   - h1 with style="font-size:32px;font-weight:700;color:#ffffff;font-family:'Playfair Display',serif;margin:0 0 8px 0;"
   - h2 with style="font-size:16px;font-weight:400;color:rgba(255,255,255,0.85);font-family:'Playfair Display',serif;margin:0;font-style:italic;"

4. Market tiles: a div with style="background-color:#1a1917;padding:12px 16px;display:grid;grid-template-columns:1fr 1fr;gap:8px;"
   Each tile is a div with style="background-color:#1e1e1c;border:1px solid #333333;border-radius:8px;padding:14px 12px;text-align:center;"
   - Tile label: style="font-size:9px;color:#666666;text-transform:uppercase;letter-spacing:0.08em;font-family:sans-serif;margin-bottom:6px;"
   - Tile value: style="font-size:18px;font-weight:700;font-family:'Playfair Display',serif;margin-bottom:3px;" — green (#30d158) if up, red (#ff453a) if down
   - Tile change: style="font-size:10px;font-family:sans-serif;" — same colour logic

5. Body wrapper div with style="background-color:#141413;padding:16px 24px;"

6. Four sections, each with:
   - Section heading: style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#D4651B;font-family:sans-serif;font-weight:600;border-bottom:1px solid #2a2926;padding-bottom:6px;margin:20px 0 10px 0;"
   - Body text: style="font-size:14px;line-height:1.8;color:#b0aca4;font-family:'Playfair Display',serif;" — MAX 4 SENTENCES
   - Callout box: style="background-color:#1e1e1c;border-left:3px solid #D4651B;padding:12px 16px;margin-top:12px;"
     - Label: style="font-size:9px;color:#D4651B;text-transform:uppercase;letter-spacing:0.07em;font-family:sans-serif;margin-bottom:5px;"
     - Text: style="font-size:13px;font-weight:600;color:#ffffff;font-family:sans-serif;line-height:1.5;" — MAX 2 SENTENCES

   Sections:
   - 01 · Capital Markets
   - 02 · Fintech Trends & Employment
   - 03 · London & Life
   - 04 · What's Cool

7. Sources div with style="background-color:#141413;padding:12px 24px;border-top:1px solid #2a2926;"
   - Label: style="font-size:9px;color:#555555;text-transform:uppercase;letter-spacing:0.06em;font-family:sans-serif;margin-bottom:4px;"
   - Links: style="font-size:10px;color:#D4651B;font-family:sans-serif;line-height:1.8;" — every source as a working hyperlink, mandatory

8. Footer div with style="background-color:#141413;padding:8px 24px 20px;border-top:1px solid #2a2926;"
   - Text: style="font-size:9px;color:#444444;font-family:sans-serif;font-style:italic;"
   - Content: "This daily digest is summarised by AI using Claude claude-sonnet-4-6 and Google Apps Script."`;

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
  ScriptApp.newTrigger('runDailyDigest')
    .timeBased()
    .everyDays(1)
    .atHour(6)
    .nearMinute(30)
    .create();
}
