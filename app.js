import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Crown, Trash2, Eye, EyeOff, Download, Upload } from 'lucide-react';

export default function GodModeFooter() {
  const [showGodModal, setShowGodModal] = useState(false);
  const [password, setPassword] = useState('');
  const [isGod, setIsGod] = useState(false);

  const correctPassword = '121524';

  const enterGodMode = () => {
    if (password === correctPassword) {
      setIsGod(true);
      setShowGodModal(false);
    } else {
      alert('Неправильный пароль, смертный');
    }
  };

  return (
    <>
      {/* === ФУТЕР С ВОЕННЫМ ЗНАЧКОМ === */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/90 border-t border-gray-800 text-gray-500 text-xs py-2 px-4 flex items-center justify-between z-50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <span>© 2025 Сделано компанией </span>
          <span className="font-bold text-red-500">mitrsht</span>
        </div>

        {/* Секретная кнопка — танк */}
        <motion.button
          whileHover={{ scale: 1.3, rotate: 360 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowGodModal(true)}
          className="text-red-600 hover:text-red-400 transition-all"
          title="Ты уверен?"
        >
          <Shield size={18} />
        </motion.button>
      </div>

      {/* === МОДАЛКА С ПАРОЛЕМ === */}
      <AnimatePresence>
        {showGodModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[9999] flex items-center justify-center"
            onClick={() => setShowGodModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-gradient-to-br from-red-900 to-black p-8 rounded-2xl border-4 border-red-600 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-3xl font-bold text-red-500 mb-6 flex items-center gap-3">
                <Crown className="animate-pulse" /> РЕЖИМ БОГА
              </h2>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введи код доступа..."
                className="w-full px-4 py-3 bg-black/80 border-2 border-red-800 rounded-lg text-white text-center text-xl tracking-widest"
                onKeyPress={(e) => e.key === 'Enter' && enterGodMode()}
                autoFocus
              />
              <button
                onClick={enterGodMode}
                className="mt-4 w-full py-3 bg-red-600 hover:bg-red-500 rounded-lg font-bold text-xl transition-all"
              >
                АКТИВИРОВАТЬ
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === ПАНЕЛЬ БОГА (появляется после входа) === */}
      <AnimatePresence>
        {isGod && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-16 left-4 right-4 bg-black/95 border-4 border-red-600 rounded-2xl p-6 z-[9998] shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-red-500 flex items-center gap-3">
                <Zap className="animate-pulse" /> РЕЖИМ БОГА АКТИВИРОВАН
              </h3>
              <button onClick={() => setIsGod(false)} className="text-red-400 hover:text-white">
                ×
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="p-4 bg-red-900/80 hover:bg-red-800 rounded-lg flex flex-col items-center gap-2 transition-all">
                <Trash2 size={28} />
                <span>Очистить всех юзеров</span>
              </button>
              <button className="p-4 bg-red-900/80 hover:bg-red-800 rounded-lg flex flex-col items-center gap-2">
                <Eye size={28} />
                <span>Видеть все чаты</span>
              </button>
              <button className="p-4 bg-red-900/80 hover:bg-red-800 rounded-lg flex flex-col items-center gap-2">
                <Download size={28} />
                <span>Экспорт БД</span>
              </button>
              <button className="p-4 bg-red-900/80 hover:bg-red-800 rounded-lg flex flex-col items-center gap-2">
                <Upload size={28} />
                <span>Импорт юзеров</span>
              </button>
              <button className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-bold col-span-2 md:col-span-4">
                СБРОСИТЬ ВСЁ НАХУЙ (ядерная кнопка)
              </button>
            </div>

            <div className="mt-4 text-center text-yellow-400 text-xs">
              Ты — бог. Не облажайся, mitrsht.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
