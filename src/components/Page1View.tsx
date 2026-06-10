/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ArrowLeft, ShieldAlert } from 'lucide-react';

interface Page1ViewProps {
  onBack: () => void;
}

const AMAZON_ORDER_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Place your Order</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
    <style>
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 20px 0;
            background-color: #f0f2f2;
            display: flex;
            flex-direction: column;
            align-items: center;
            font-family: Arial, Helvetica, sans-serif;
        }

        #screenshot-area {
            width: 390px;
            background-color: white;
            color: #0f1111;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }

        .top-header {
            background-color: #fbd18d;
            height: 12px;
            width: 100%;
        }

        .privacy-section {
            padding: 14px 18px;
            font-size: 14px;
            line-height: 1.4;
            color: #0f1111;
            border-bottom: 1px solid #e7e7e7;
        }
        .link {
            color: #007185;
            text-decoration: none;
        }

        .btn-box {
            padding: 18px;
            text-align: center;
        }
        .order-btn {
            background: #ffd814;
            border: 1px solid #fcd200;
            border-radius: 25px;
            padding: 12px;
            width: 100%;
            font-size: 18px;
            color: black;
            font-weight: 500;
            cursor: pointer;
            transition: 0.2s;
        }
        .order-btn:active {
            transform: scale(0.98);
        }

        .price-table {
            padding: 5px 18px 15px 18px;
            border-bottom: 1px solid #e7e7e7;
        }
        .price-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 15px;
            align-items: baseline;
        }
        .total-row {
            margin-top: 12px;
            font-size: 19px;
            font-weight: 700;
            padding-top: 5px;
            /* border-top removed as requested */
        }

        .editable-amount {
            padding: 2px 4px;
            min-width: 85px;
            text-align: right;
            cursor: text;
            display: inline-block;
            border-radius: 4px;
            background-color: transparent;
            border: 1px solid transparent;
            font-weight: normal;
            color: #0f1111;
        }
        .editable-amount:focus {
            background-color: #fff8e1;
            border: 1px solid #ffa41c;
            outline: none;
        }

        .total-normal {
            font-weight: 700;
            font-size: 19px;
            color: #0f1111;
            background: transparent;
            display: inline-block;
            text-align: right;
        }

        .payment-section {
            padding: 18px;
            border-top: 8px solid #f0f2f2;
        }
        .bank-title {
            font-weight: 700;
            font-size: 16px;
            margin-bottom: 10px;
        }
        .blue-links {
            color: #007185;
            font-size: 15px;
            margin-bottom: 10px;
            display: block;
            text-decoration: none;
        }
        .blue-links:hover {
            text-decoration: underline;
            cursor: pointer;
        }

        .controls {
            margin-top: 25px;
            width: 390px;
        }
        .save-btn {
            width: 100%;
            background: #232f3e;
            color: white;
            padding: 15px;
            border: none;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            font-size: 16px;
            transition: 0.2s;
        }
        .save-btn:active {
            background-color: #0f1a24;
        }
    </style>
</head>
<body>

<div id="screenshot-area">
    <div class="top-header"></div>

    <div class="privacy-section">
        By placing your order, you agree to Amazon's <span class="link">privacy notice</span> and <span class="link">conditions of use</span>.
    </div>

    <div class="btn-box">
        <button class="order-btn">Place your order</button>
    </div>

    <div class="price-table">
        <div class="price-row">
            <span>Items:</span>
            <span class="editable-amount" id="itemsAmount" contenteditable="true">$0.00</span>
        </div>
        <div class="price-row">
            <span>Shipping & handling:</span>
            <span class="editable-amount" id="shippingAmount" contenteditable="true">$0.00</span>
        </div>
        <div class="price-row">
            <span>Estimated tax to be collected:</span>
            <span class="editable-amount" id="taxAmount" contenteditable="true">$0.00</span>
        </div>
        <div class="price-row total-row">
            <span><strong>Order total:</strong></span>
            <span class="total-normal" id="totalAmount">$0.00</span>
        </div>
    </div>

    <div class="payment-section">
        <div class="bank-title">Paying with Bank Account 908</div>
        <a href="#" class="blue-links">Change payment method</a>
        <a href="#" class="blue-links">Use a gift card, voucher, or promo code</a>
    </div>
</div>

<div class="controls">
    <button class="save-btn" onclick="downloadUI()"> Download</button>
</div>

<script>
    (function() {
        const sourceFields = ['itemsAmount', 'shippingAmount', 'taxAmount'];
        const totalSpan = document.getElementById('totalAmount');

        function parseDollarValue(str) {
            if (!str) return 0;
            let cleaned = str.toString().trim().replace(/[^0-9.-]/g, '');
            if (cleaned === '' || cleaned === '-') return 0;
            let num = parseFloat(cleaned);
            return isNaN(num) ? 0 : num;
        }

        function formatAsMoney(value) {
            let number = parseFloat(value);
            if (isNaN(number)) number = 0;
            return '$' + number.toFixed(2);
        }

        function updateTotal() {
            let sum = 0;
            for (let id of sourceFields) {
                const element = document.getElementById(id);
                if (element) {
                    let rawText = element.innerText || element.textContent;
                    sum += parseDollarValue(rawText);
                }
            }
            if (totalSpan) totalSpan.innerText = formatAsMoney(sum);
        }

        function formatField(fieldId) {
            const field = document.getElementById(fieldId);
            if (!field) return;
            let raw = field.innerText || field.textContent;
            let num = parseDollarValue(raw);
            let formatted = formatAsMoney(num);
            if (field.innerText !== formatted) field.innerText = formatted;
            updateTotal();
        }

        function bindEvents() {
            for (let id of sourceFields) {
                const field = document.getElementById(id);
                if (field) {
                    field.addEventListener('input', () => updateTotal());
                    field.addEventListener('blur', () => formatField(id));
                    field.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            field.blur();
                        }
                    });
                }
            }
        }

        function initializeValues() {
            for (let id of sourceFields) {
                const field = document.getElementById(id);
                if (field) {
                    let raw = field.innerText || field.textContent;
                    field.innerText = formatAsMoney(parseDollarValue(raw));
                }
            }
            updateTotal();
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                bindEvents();
                initializeValues();
            });
        } else {
            bindEvents();
            initializeValues();
        }
    })();

    function downloadUI() {
        const area = document.getElementById('screenshot-area');
        if (!area) return;
        html2canvas(area, {
            scale: 3,
            backgroundColor: "#ffffff",
            logging: false,
            useCORS: false
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'amazon_order_summary.jpg';
            link.href = canvas.toDataURL('image/jpeg', 0.95);
            link.click();
        }).catch(error => {
            console.error("Download failed:", error);
            alert("Could not generate image. Please check console.");
        });
    }

    document.addEventListener('DOMContentLoaded', function() {
        const orderBtn = document.querySelector('.order-btn');
        if (orderBtn) {
            orderBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const totalElem = document.getElementById('totalAmount');
                alert("✅ Order summary ready (Demo mode).\\nTotal: " + (totalElem ? totalElem.innerText : "$0.00"));
            });
        }
    });
</script>
</body>
</html>`;

export default function Page1View({ onBack }: Page1ViewProps) {
  return (
    <div id="page1-viewport" className="relative h-screen bg-[#040408] text-slate-100 flex flex-col overflow-hidden select-none">
      
      {/* Background cyber grid detail */}
      <div className="absolute inset-0 -z-50 h-full w-full bg-[linear-gradient(to_right,#0c0f1d_1px,transparent_1px),linear-gradient(to_bottom,#0c0f1d_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />
      <div className="absolute top-1/4 left-1/4 -z-40 h-96 w-96 rounded-full bg-cyan-500/5 blur-[120px]" />

      {/* Header frame */}
      <div className="relative flex h-16 shrink-0 items-center justify-between border-b border-white/5 bg-zinc-950/40 px-6 backdrop-blur-md z-10">
        <div className="flex items-center gap-2">
          {/* Back button */}
          <motion.button
            id="page1-back-btn"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-zinc-900/60 hover:bg-zinc-900/95 hover:border-cyan-500/30 px-3.5 py-1.5 font-mono text-[10px] font-semibold tracking-wider text-slate-200 shadow-md outline-none transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-cyan-400" />
            RETURN
          </motion.button>
        </div>

        <div className="flex items-center gap-2 font-mono text-[9px] text-amber-400 tracking-[0.15em] uppercase">
          <ShieldAlert className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
          VERIFIED ORDER RENDERER_SHELL
        </div>
      </div>

      {/* Verbatim Content Viewer in Fitted responsive Sandbox */}
      <div className="flex-1 min-h-0 w-full relative bg-[#f0f2f2]">
        <iframe
          key="amazon-order-frame-page1"
          id="amazon-order-frame-page1"
          srcDoc={AMAZON_ORDER_TEMPLATE}
          title="Amazon Order Summary Screen"
          sandbox="allow-scripts allow-downloads allow-same-origin allow-modals"
          className="w-full h-full border-none block"
        />
      </div>

    </div>
  );
}

