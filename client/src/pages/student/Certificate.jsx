import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { theme } from '../../hooks/useAnimationVariants'

const Certificate = ({ studentName, courseTitle, educatorName, completionDate, certificateId, onClose }) => {
  const certRef = useRef(null)

  const handleDownload = async () => {
    try {
      // Dynamically import jsPDF
      const { jsPDF } = await import('jspdf')

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      })

      const W = pdf.internal.pageSize.getWidth()
      const H = pdf.internal.pageSize.getHeight()

      // ── Background ────────────────────────────────────────────────────────
      pdf.setFillColor(5, 13, 26)         // navy.deepest
      pdf.rect(0, 0, W, H, 'F')

      // ── Outer gold border ─────────────────────────────────────────────────
      pdf.setDrawColor(212, 168, 67)
      pdf.setLineWidth(1.5)
      pdf.rect(8, 8, W - 16, H - 16)

      // ── Inner gold border ─────────────────────────────────────────────────
      pdf.setLineWidth(0.4)
      pdf.rect(12, 12, W - 24, H - 24)

      // ── Corner decorations ────────────────────────────────────────────────
      const corners = [[14, 14], [W - 14, 14], [14, H - 14], [W - 14, H - 14]]
      corners.forEach(([x, y]) => {
        pdf.setFillColor(212, 168, 67)
        pdf.circle(x, y, 2, 'F')
      })

      // ── Top gold line ─────────────────────────────────────────────────────
      pdf.setDrawColor(212, 168, 67)
      pdf.setLineWidth(0.5)
      pdf.line(30, 35, W - 30, 35)

      // ── Platform name ─────────────────────────────────────────────────────
      pdf.setTextColor(212, 168, 67)
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'bold')
      pdf.text('SMART LEARNING HUB', W / 2, 28, { align: 'center' })

      // ── Certificate of Completion ─────────────────────────────────────────
      pdf.setTextColor(240, 230, 204)   // cream
      pdf.setFontSize(28)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Certificate of Completion', W / 2, 55, { align: 'center' })

      // ── Gold divider ──────────────────────────────────────────────────────
      pdf.setDrawColor(212, 168, 67)
      pdf.setLineWidth(0.5)
      pdf.line(W / 2 - 40, 60, W / 2 + 40, 60)

      // ── This is to certify ────────────────────────────────────────────────
      pdf.setTextColor(168, 184, 208)   // secondary
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'normal')
      pdf.text('This is to certify that', W / 2, 75, { align: 'center' })

      // ── Student name ──────────────────────────────────────────────────────
      pdf.setTextColor(240, 196, 85)    // gold.bright
      pdf.setFontSize(32)
      pdf.setFont('helvetica', 'bold')
      pdf.text(studentName, W / 2, 95, { align: 'center' })

      // ── Underline for name ────────────────────────────────────────────────
      const nameWidth = pdf.getTextWidth(studentName)
      pdf.setDrawColor(212, 168, 67)
      pdf.setLineWidth(0.4)
      pdf.line(W / 2 - nameWidth / 2, 98, W / 2 + nameWidth / 2, 98)

      // ── Has successfully completed ────────────────────────────────────────
      pdf.setTextColor(168, 184, 208)
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'normal')
      pdf.text('has successfully completed the course', W / 2, 112, { align: 'center' })

      // ── Course title ──────────────────────────────────────────────────────
      pdf.setTextColor(240, 230, 204)
      pdf.setFontSize(20)
      pdf.setFont('helvetica', 'bold')
      pdf.text(courseTitle, W / 2, 128, { align: 'center' })

      // ── Gold box around course title ──────────────────────────────────────
      const titleWidth = pdf.getTextWidth(courseTitle)
      pdf.setDrawColor(212, 168, 67)
      pdf.setLineWidth(0.3)
      pdf.roundedRect(W / 2 - titleWidth / 2 - 6, 120, titleWidth + 12, 12, 2, 2)

      // ── Instructed by ─────────────────────────────────────────────────────
      pdf.setTextColor(168, 184, 208)
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      pdf.text(`Instructed by: ${educatorName}`, W / 2, 143, { align: 'center' })

      // ── Bottom divider ────────────────────────────────────────────────────
      pdf.setDrawColor(212, 168, 67)
      pdf.setLineWidth(0.3)
      pdf.line(30, 152, W - 30, 152)

      // ── Date, Certificate ID ──────────────────────────────────────────────
      pdf.setTextColor(90, 122, 154)    // muted
      pdf.setFontSize(8.5)
      pdf.setFont('helvetica', 'normal')
      pdf.text(`Date of Completion: ${completionDate}`, 35, 162)
      pdf.text(`Certificate ID: ${certificateId}`, W / 2, 162, { align: 'center' })
      pdf.text('Verify at: smartlearninghub.com/verify', W - 35, 162, { align: 'right' })

      // ── Signature lines ───────────────────────────────────────────────────
      pdf.setDrawColor(212, 168, 67)
      pdf.setLineWidth(0.3)
      pdf.line(50, 178, 110, 178)
      pdf.line(W - 110, 178, W - 50, 178)

      pdf.setTextColor(90, 122, 154)
      pdf.setFontSize(8)
      pdf.text('Educator Signature', 80, 183, { align: 'center' })
      pdf.text('Platform Director', W - 80, 183, { align: 'center' })

      // ── Star decorations ──────────────────────────────────────────────────
      pdf.setTextColor(212, 168, 67)
      pdf.setFontSize(14)
      pdf.text('✦', 25, H / 2, { align: 'center' })
      pdf.text('✦', W - 25, H / 2, { align: 'center' })

      // ── Save ──────────────────────────────────────────────────────────────
      pdf.save(`Certificate_${studentName.replace(/\s+/g, '_')}_${courseTitle.replace(/\s+/g, '_')}.pdf`)

    } catch (error) {
      console.error('PDF generation error:', error)
      alert('Error generating certificate. Please try again.')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='fixed inset-0 flex items-center justify-center z-50 p-4'
      style={{ background: 'rgba(5,13,26,0.92)', backdropFilter: 'blur(8px)' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 280, damping: 25 }}
        className='relative w-full max-w-3xl'
      >
        {/* Close button */}
        <motion.button onClick={onClose}
          className='absolute -top-4 -right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm'
          style={{ background: theme.navy.mid, border: '1px solid rgba(212,168,67,0.3)', color: theme.text.muted }}
          whileHover={{ scale: 1.1, color: theme.gold.bright }}>
          ✕
        </motion.button>

        {/* Certificate preview */}
        <div ref={certRef}
          className='w-full rounded-2xl overflow-hidden relative'
          style={{
            background: 'linear-gradient(135deg, #050d1a 0%, #0a1628 50%, #050d1a 100%)',
            border: '2px solid rgba(212,168,67,0.6)',
            boxShadow: '0 0 60px rgba(212,168,67,0.2), inset 0 0 60px rgba(212,168,67,0.03)',
            aspectRatio: '1.414 / 1',
            padding: '32px',
          }}
        >
          {/* Corner decorations */}
          {['top-4 left-4', 'top-4 right-4', 'bottom-4 left-4', 'bottom-4 right-4'].map((pos, i) => (
            <div key={i} className={`absolute ${pos} w-2 h-2 rounded-full`}
              style={{ background: theme.gold.bright }} />
          ))}

          {/* Inner border */}
          <div className='absolute inset-3 rounded-xl pointer-events-none'
            style={{ border: '1px solid rgba(212,168,67,0.2)' }} />

          {/* Top line */}
          <div className='w-full h-px mb-4' style={{ background: `linear-gradient(90deg, transparent, ${theme.gold.bright}, transparent)` }} />

          {/* Platform */}
          <p className='text-center text-xs uppercase tracking-widest font-bold mb-3'
            style={{ color: theme.gold.pure, letterSpacing: '0.3em', fontFamily: "'DM Sans', sans-serif" }}>
            SMART LEARNING HUB
          </p>

          {/* Title */}
          <h1 className='text-center font-bold mb-2'
            style={{ fontSize: 'clamp(1.2rem, 3vw, 2rem)', color: theme.text.primary, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            Certificate of Completion
          </h1>

          {/* Gold divider */}
          <div className='w-24 h-px mx-auto mb-4' style={{ background: theme.gradients.gold }} />

          {/* This certifies */}
          <p className='text-center text-xs mb-2' style={{ color: theme.text.secondary, fontFamily: "'DM Sans', sans-serif" }}>
            This is to certify that
          </p>

          {/* Student name */}
          <div className='text-center mb-1'>
            <span className='font-bold' style={{
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
              background: theme.gradients.gold,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              fontFamily: "'Cormorant Garamond', Georgia, serif",
            }}>
              {studentName}
            </span>
          </div>
          <div className='w-48 h-px mx-auto mb-3' style={{ background: 'rgba(212,168,67,0.4)' }} />

          {/* Has completed */}
          <p className='text-center text-xs mb-2' style={{ color: theme.text.secondary, fontFamily: "'DM Sans', sans-serif" }}>
            has successfully completed the course
          </p>

          {/* Course title */}
          <div className='mx-auto w-fit px-4 py-1.5 rounded-lg mb-2'
            style={{ border: '1px solid rgba(212,168,67,0.4)', background: 'rgba(212,168,67,0.05)' }}>
            <p className='text-center font-semibold'
              style={{ fontSize: 'clamp(0.9rem, 2vw, 1.3rem)', color: theme.text.primary, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              {courseTitle}
            </p>
          </div>

          {/* Instructor */}
          <p className='text-center text-xs mb-4' style={{ color: theme.text.muted, fontFamily: "'DM Sans', sans-serif" }}>
            Instructed by <span style={{ color: theme.gold.bright }}>{educatorName}</span>
          </p>

          {/* Bottom divider */}
          <div className='w-full h-px mb-3' style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.3), transparent)' }} />

          {/* Footer info */}
          <div className='flex items-center justify-between text-xs' style={{ color: theme.text.muted, fontFamily: "'DM Sans', sans-serif" }}>
            <span>Date: {completionDate}</span>
            <span style={{ color: 'rgba(212,168,67,0.4)' }}>ID: {certificateId}</span>
            <span>smartlearninghub.com</span>
          </div>

          {/* Side decorations */}
          <div className='absolute left-3 top-1/2 -translate-y-1/2 text-lg' style={{ color: 'rgba(212,168,67,0.3)' }}>✦</div>
          <div className='absolute right-3 top-1/2 -translate-y-1/2 text-lg' style={{ color: 'rgba(212,168,67,0.3)' }}>✦</div>

        </div>

        {/* Download button */}
        <motion.button onClick={handleDownload}
          className='w-full mt-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2'
          style={{ background: theme.gradients.gold, color: theme.navy.deepest, fontFamily: "'DM Sans', sans-serif" }}
          whileHover={{ scale: 1.02, boxShadow: '0 0 28px rgba(212,168,67,0.5)' }}
          whileTap={{ scale: 0.98 }}>
          ⬇️ Download Certificate (PDF)
        </motion.button>

        <p className='text-center text-xs mt-2' style={{ color: theme.text.muted, fontFamily: "'DM Sans', sans-serif" }}>
          Your certificate is ready to download and share
        </p>
      </motion.div>
    </motion.div>
  )
}

export default Certificate
