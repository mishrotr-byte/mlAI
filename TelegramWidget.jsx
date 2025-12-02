import React from 'react';

export default function TelegramWidget() {
  return (
    <div className="fixed bottom-4 right-4">
      <script src="https://your-server.com/js/widget.js" /> {/* Из intergram  */}
      <script>
        {`
          window.intergramId = "${process.env.TELEGRAM_BOT_TOKEN}";
          window.intergramServer = "https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}";
        `}
      </script>
      <a href="https://t.me/mmrls_bot" className="p-4 bg-blue-500 rounded-full">Перейти в @mmrls_bot</a>
    </div>
  );
}
