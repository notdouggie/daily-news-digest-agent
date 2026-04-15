function runDailyDigest() {
  const apiKey = PropertiesService.getScriptProperties().getProperty('ANTHROPIC_API_KEY');
  const userEmail = 'douglascch@gmail.com';

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', weekday: 'short' });
  const subject = `☀️ Your Daily Digest - ${dateStr}`;

  // PROMPT
  const prompt = `You are a Geopolitical & Finance Analyst acting as Chief of Staff for Doug — 33 years old, Fintech Product Manager in London, £1M portfolio, HK-born, global ambitions.

  # Objective
  Deliver a 1-minute briefing focused on: Fintech career, Portfolio Macro, and London living and working.

  # Sources & Search Strategy
  Perform a maximum of 4 web searches total. Be selective:
  1. PRIMARY: JP Morgan Private Bank, MarketWatch, CNBC, The Guardian, South China Morning Post, Al Jazeera.
  2. AGGREGATORS: "FT reports today" or "Reuters says today" on Yahoo Finance and Google News.
  3. DATA: LSEG and gov.uk for raw policy/market data.

  # Search for today's date regarding:
  - UK mortgage rate forecasts and London property trends
  - UK/EU Fintech regulatory updates on AI, consumer acts, and operational regulations
  - Global trade/geopolitical risks affecting S&P 500 & FTSE 100
  - UK policy changes impacting quality of life in London (Childcare, Tax, Stamp Duty)

  # Output format — return valid JSON only. No markdown, no code fences, no backticks. Use these exact keys:
  {
    "PREHEADER": "10-word vibe summary of the day",
    "VIBE_SUMMARY": "same 10-word summary",
    "SP500": "0,000", "SP500_CHANGE": "▲ 0.00%",
    "TNX": "0.00%", "TNX_CHANGE": "▲ 0.00",
    "GOLD": "$0,000", "GOLD_CHANGE": "▲ 0.00%",
    "VIX": "00.00", "VIX_CHANGE": "▼ 0.00%",
    "CAPITAL_MARKETS": "max 4 sentences",
    "ACTION_1": "max 2 sentences",
    "FINTECH": "max 4 sentences",
    "ACTION_2": "max 2 sentences",
    "LONDON": "max 4 sentences",
    "ACTION_3": "max 2 sentences",
    "COOL": "max 3 sentences",
    "SOURCES": "<a href='URL' style='color:#D4651B;'>Source Name</a>, ..."
  }`;

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

    <div style="padding:0 32px 32px;background:#141413;">
      <h3 style="color:#D4651B;border-bottom:1px solid #333;padding-bottom:8px;">📈 Capital Markets</h3>
      <p style="line-height:1.7;font-size:14px;color:#e0e0e0;">{{CAPITAL_MARKETS}}</p>
      <p style="font-size:14px;"><strong style="color:#D4651B;">What this means for you:</strong> <span style="color:#e0e0e0;">{{ACTION_1}}</span></p>

      <h3 style="color:#D4651B;border-bottom:1px solid #333;padding-bottom:8px;">💻 Fintech Trends & Employment</h3>
      <p style="line-height:1.7;font-size:14px;color:#e0e0e0;">{{FINTECH}}</p>
      <p style="font-size:14px;"><strong style="color:#D4651B;">What this means for you:</strong> <span style="color:#e0e0e0;">{{ACTION_2}}</span></p>

      <h3 style="color:#D4651B;border-bottom:1px solid #333;padding-bottom:8px;">🏙️ London & Life</h3>
      <p style="line-height:1.7;font-size:14px;color:#e0e0e0;">{{LONDON}}</p>
      <p style="font-size:14px;"><strong style="color:#D4651B;">What this means for you:</strong> <span style="color:#e0e0e0;">{{ACTION_3}}</span></p>

      <h3 style="color:#D4651B;border-bottom:1px solid #333;padding-bottom:8px;">🎲 What's Cool</h3>
      <p style="line-height:1.7;font-size:14px;color:#e0e0e0;">{{COOL}}</p>
    </div>

    <div style="padding:16px 32px;background:#1a1a1a;font-size:12px;color:#666;">
      <strong>Sources:</strong> {{SOURCES}}
    </div>

    <div style="padding:8px 32px 20px;background:#141413;border-top:1px solid #2a2926;">
      <p style="font-size:9px;color:#444;font-style:italic;">This daily digest is summarised by AI using Claude claude-sonnet-4-6 and Google Apps Script.</p>
    </div>

  </body>
  </html>`;

  // API CALL
  const response = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    payload: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 5000,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages: [{ role: 'user', content: prompt }]
    })
  });

  // PARSE JSON AND INJECT INTO TEMPLATE
  const response = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    payload: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages: [{ role: 'user', content: prompt }]
    })
  });

  const data = JSON.parse(response.getContentText());
  const raw = data.content.filter(b => b.type === 'text').map(b => b.text).join('');
  const content = JSON.parse(raw);

  let html = template;
  Object.keys(content).forEach(key => {
    html = html.replaceAll(`{{${key}}}`, content[key]);
  });

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