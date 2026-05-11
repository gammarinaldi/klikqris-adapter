'use client'

import React from 'react'
import Image from 'next/image'

interface QRISPosterProps {
  qrisUrl: string
  merchantName?: string
  nmid?: string
  terminalId?: string
}

const QRISPoster: React.FC<QRISPosterProps> = ({
  qrisUrl,
  merchantName = "TOKO_ANDA",
  nmid = "ID12345678910",
  terminalId = "A01"
}) => {
  return (
    <div className="relative w-full max-w-sm mx-auto bg-white rounded-lg shadow-xl overflow-hidden font-sans text-gray-900 border border-gray-200 flex flex-col">
      {/* Red Triangle Top Left */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-[#e31e24] -translate-x-1/2 -translate-y-1/2 rotate-45 z-0" />

      {/* Header Logos */}
      <div className="relative z-10 p-6 flex justify-between items-start">
        <div className="flex flex-col">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_QRIS.svg"
            alt="QRIS"
            width={120}
            height={40}
            className="h-8 w-auto object-contain mb-1"
          />
          <span className="text-[8px] font-bold text-gray-800 leading-tight">
            QR Code Standar<br />Pembayaran Nasional
          </span>
        </div>
        <Image
          src="/gpn-logo.png"
          alt="GPN"
          width={60}
          height={60}
          className="h-12 w-auto object-contain"
        />
      </div>

      {/* Merchant Info */}
      <div className="relative z-10 text-center mt-2 px-4">
        <h2 className="text-xl font-bold uppercase tracking-tight text-gray-900">{merchantName}</h2>
        <p className="text-sm font-medium text-gray-700 mt-1">NMID : {nmid}</p>
        <p className="text-xs font-semibold text-gray-600">{terminalId}</p>
      </div>

      {/* QR Code Container */}
      <div className="relative z-10 px-6 mt-4" style={{ marginBottom: '24px' }}>
        <div className="bg-white p-2 rounded-lg border-2 border-gray-100 shadow-sm flex items-center justify-center relative overflow-hidden mx-auto" style={{ width: '80%', aspectRatio: '1/1' }}>
          {/* Subtle background pattern like the original */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />

          <Image
            src={qrisUrl}
            alt="QRIS QR Code"
            width={400}
            height={400}
            unoptimized
            className="w-full h-full object-contain relative z-10"
          />
        </div>
      </div>

      {/* Footer Text */}
      <div className="relative z-10 text-center pb-2">
        <h3 className="text-lg font-bold text-gray-800 tracking-wide">SATU QRIS UNTUK SEMUA</h3>
        <p className="text-[10px] text-gray-500 mt-1">
          Cek aplikasi penyelenggara di:<br />
          <span className="font-bold"><a href='https://aspi-indonesia.or.id'>aspi-indonesia.or.id</a></span>
        </p>
      </div>

      {/* Footer Decoration & Instructions */}
      <div className="relative z-10 mt-auto p-4 flex justify-between items-end overflow-hidden">
        {/* Red Triangle Bottom Right */}
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#e31e24] translate-x-1/3 translate-y-1/3 rotate-45 z-0" />

        <div className="relative z-10 flex flex-col text-[8px] text-gray-500 font-medium">
          <p>Dicetak oleh: 93600915</p>
          <p>Versi cetak: 1.0.07.03.24</p>
        </div>
      </div>
    </div>
  )
}

export default QRISPoster
