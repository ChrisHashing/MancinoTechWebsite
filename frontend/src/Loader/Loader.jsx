import React from 'react'
// import AnimatedLogo from '../assets/logo-animated.gif'
import style from './Loader.module.css'
import { motion, AnimatePresence } from 'framer-motion'

export default function Loader() {
  return (
    <AnimatePresence>
      <motion.div
        className={style.loader}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* <img className={style.logo} src={AnimatedLogo} alt="" /> */}
      </motion.div>
    </AnimatePresence>
  )
}
