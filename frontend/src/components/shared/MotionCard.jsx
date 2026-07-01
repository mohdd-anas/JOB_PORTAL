import { motion } from 'motion/react'

const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.05, duration: 0.3, ease: 'easeOut' },
    }),
}

const MotionCard = ({ children, className = '', index = 0, onClick }) => (
    <motion.div
        variants={cardVariants}
        custom={index}
        initial='hidden'
        animate='visible'
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className={className}
        onClick={onClick}
    >
        {children}
    </motion.div>
)

export default MotionCard
