/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ArrowLeft, ShieldAlert } from 'lucide-react';

interface TrackingViewProps {
  onBack: () => void;
}

const AMAZON_PENDING_ORDER_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Amazon Order Tracker</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #f7f7f7; font-family: "Amazon Ember", Arial, sans-serif; color: #0f1111; display: flex; flex-direction: column; align-items: center; padding: 20px 10px; }
        
        /* এখানে মার্জিন এবং বর্ডার রাউন্ড ঠিক করা হয়েছে */
        #editor-container { 
            width: 100%; 
            max-width: 412px; 
            background: white; 
            border: 1px solid #e6e6e6; 
            margin: 0 auto; 
            border-radius: 8px; 
            overflow: hidden; 
        }
        
        #capture-zone { background: white; padding: 14px; }
        
        .header-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; margin-top: 5px; }
        .arriving-title { font-size: 22px; font-weight: 700; letter-spacing: -0.3px; color: #0f1111; outline: none; }
        .mini-img-box { width: 68px; height: 68px; border: 1px solid #f2f2f2; border-radius: 4px; padding: 4px; background: #fff; display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 3px rgba(0,0,0,0.08); cursor: pointer; }
        .mini-img-box img { max-width: 100%; max-height: 100%; object-fit: contain; }

        .progress-container { position: relative; margin: 22px 0px 10px 0px; height: 24px; }
        .base-line { position: absolute; height: 3px; background: #879596; left: 10px; right: 10px; top: 50%; transform: translateY(-50%); z-index: 1; }
        .nodes-layer { position: absolute; width: 100%; height: 100%; display: flex; justify-content: space-between; align-items: center; z-index: 2; }
        
        .node { width: 20px; height: 20px; border-radius: 50%; background: white; border: 2px solid #879596; position: relative; display: flex; align-items: center; justify-content: center; }
        .node .tick-icon { display: none; width: 11px; height: 9px; fill: none; stroke: white; stroke-width: 2.8; stroke-linecap: round; stroke-linejoin: round; }

        .node.active-capsule { width: 20px; height: 20px; background: #3478cd; border: none; border-radius: 50%; overflow: visible; }
        .node.active-capsule .tick-icon { display: block; position: relative; z-index: 5; }
        .node.active-capsule::after { content: ""; position: absolute; left: 10px; top: 5px; width: 18px; height: 10px; background: #3478cd; border-top-right-radius: 5px; border-bottom-right-radius: 5px; z-index: 2; }
        .node.passed-check { width: 20px; height: 20px; background: #3478cd; border-color: #3478cd; border-radius: 50%; }
        .node.passed-check .tick-icon { display: block; }

        .labels-row { display: grid; grid-template-columns: 1.15fr 1.1fr 1fr 0.75fr; margin: 8px 0 12px 0; font-size: 12px; color: #0f1111; }
        .labels-row .lbl-0 { text-align: left; font-weight: 700; }
        .labels-row .lbl-1 { text-align: left; color: #565959; }
        .labels-row .lbl-2 { text-align: center; color: #565959; }
        .labels-row .lbl-3 { text-align: right; color: #565959; }

        .top-buttons-wrapper { display: grid; grid-template-columns: 31% 65%; gap: 4%; margin-top: -4px; margin-bottom: 14px; }
        .btn-cancel-custom, .btn-update-custom { display: flex; align-items: center; justify-content: center; background: white; border: 1px solid #bdc1c1; border-radius: 20px; font-size: 13px; color: #0f1111; height: 33px; white-space: nowrap; padding: 0 10px; box-shadow: 0 1px 2px rgba(0,0,0,0.03); cursor: pointer; }

        .ui-divider { height: 1px; background: #e6e6e6; margin: 10px 0; }

        .see-details-bar { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; font-size: 14px; color: #0f1111; cursor: pointer; }
        .see-details-bar span { font-weight: 700; }
        .see-details-bar .chevron-icon { width: 10px; height: 6px; fill: none; stroke: #0f1111; stroke-width: 2px; }

        .main-product-layout { display: flex; gap: 12px; margin: 15px 0; }
        .main-prod-img { width: 82px; height: 82px; border: 1px solid #f2f2f2; border-radius: 4px; padding: 4px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .main-prod-img img { max-width: 100%; max-height: 100%; object-fit: contain; }
        .prod-name { font-size: 14px; font-weight: 700; line-height: 1.3; color: #0f1111; }
        .seller-text { font-size: 13px; color: #565959; margin-bottom: 2px; }
        .seller-text span { color: #007185; }
        .prod-price-tag { font-size: 14px; font-weight: 400; color: #0f1111; }

        .action-pills-container { display: flex; flex-wrap: wrap; gap: 8px; margin: 15px 0; }
        .pill-item { padding: 8px 12px; background: white; border: 1px solid #bdc1c1; border-radius: 20px; font-size: 13px; text-align: center; color: #0f1111; display: flex; align-items: center; justify-content: center; min-height: 33px; line-height: 1.2; white-space: nowrap; cursor: pointer; }
        .pill-item.brand-yellow { background: #ffd814; border-color: #fcd200; }

        .summary-header { font-size: 18px; font-weight: 700; color: #0f1111; margin: 15px 0 8px 0; }
        .math-table-row { display: flex; justify-content: space-between; font-size: 14px; color: #0f1111; margin-bottom: 7px; }
        .grand-total-row { display: flex; justify-content: space-between; font-size: 15px; font-weight: 700; color: #0f1111; margin-top: 5px; padding-top: 5px; }
        .view-invoice-link { font-size: 14px; color: #007185; margin-top: 15px; cursor: pointer; }
        
        .panel-tool { margin-top: 20px; background: #f7f7f7; padding: 15px; width: 100%; display: flex; justify-content: center; }
        .btn-download-now { background: #111; color: white; border: none; padding: 10px 40px; border-radius: 20px; font-size: 14px; font-weight: bold; cursor: pointer; }
    </style>
</head>
<body>

<div id="editor-container">
    <div id="capture-zone">
        <div class="header-row">
            <div class="arriving-title" contenteditable="true">Arriving tomorrow</div>
            <div class="mini-img-box" onclick="openFileUploader()"><img src="https://via.placeholder.com/60" id="mImg" alt="Thumb"></div>
        </div>

        <div class="progress-container">
            <div class="base-line"></div>
            <div class="nodes-layer">
                <div class="node active-capsule" id="n-0"><svg class="tick-icon" viewBox="0 0 12 10"><path d="M2 5.2 l2.3 2.3 l5.5 -5.8" /></svg></div>
                <div class="node" id="n-1"><svg class="tick-icon" viewBox="0 0 12 10"><path d="M2 5.2 l2.3 2.3 l5.5 -5.8" /></svg></div>
                <div class="node" id="n-2"><svg class="tick-icon" viewBox="0 0 12 10"><path d="M2 5.2 l2.3 2.3 l5.5 -5.8" /></svg></div>
                <div class="node" id="n-3"><svg class="tick-icon" viewBox="0 0 12 10"><path d="M2 5.2 l2.3 2.3 l5.5 -5.8" /></svg></div>
            </div>
        </div>
        
        <div class="labels-row">
            <span class="lbl-0" id="l-0" onclick="updateTimeline(0)">Ordered</span>
            <span class="lbl-1" id="l-1" onclick="updateTimeline(1)">Shipped</span>
            <span class="lbl-2" id="l-2" onclick="updateTimeline(2)">Out for<br>delivery</span>
            <span class="lbl-3" id="l-3" onclick="updateTimeline(3)">Delivered</span>
        </div>

        <div class="top-buttons-wrapper">
            <div class="btn-cancel-custom">Cancel order</div>
            <div class="btn-update-custom">Update delivery instructions</div>
        </div>

        <div class="ui-divider"></div>
        <div class="see-details-bar"><span>See details</span><svg class="chevron-icon" viewBox="0 0 10 6"><path d="M1 5 L5 1 L9 5" /></svg></div>
        <div class="ui-divider"></div>

        <div class="main-product-layout">
            <div class="main-prod-img" onclick="openFileUploader()"><img src="https://via.placeholder.com/85" id="pImg" alt="Main Preview"></div>
            <div class="main-prod-info">
                <div class="prod-name" contenteditable="true">B-Qtech Vehicle Backup ReVie...</div>
                <div class="seller-text">Sold by: <span contenteditable="true">Store-name</span></div>
                <div class="prod-price-tag" contenteditable="true" id="editPrice">$0.00</div>
            </div>
        </div>

        <div class="action-pills-container">
            <div class="pill-item brand-yellow">Track package</div>
            <div class="pill-item">Cancel items</div>
            <div class="pill-item">Ask Product Question</div>
            <div class="pill-item">Write a product review</div>
            <div class="pill-item">Buy it again</div>
            <div class="pill-item">Change Payment Method</div>
        </div>

        <div class="ui-divider"></div>
        <div class="summary-header">Order summary</div>
        <div class="summary-info-block">Order placed <span contenteditable="true">February 5, 2026</span><br>Order # <span contenteditable="true" style="text-decoration: none;">113-8303859-4454648</span></div>

        <div class="math-table-row"><span>Item(s) Subtotal:</span><span class="right-val" contenteditable="true" id="subTotal">$0.00</span></div>
        <div class="math-table-row"><span>Shipping &amp; Handling:</span><span class="right-val" contenteditable="true" id="shipTotal">$0.00</span></div>
        <div class="math-table-row"><span>Total before tax:</span><span class="right-val" id="beforeTaxTotal">$0.00</span></div>
        <div class="math-table-row"><span>Estimated tax to be collected:</span><span class="right-val" contenteditable="true" id="taxTotal">$0.00</span></div>
        <div class="grand-total-row"><span>Grand Total:</span><span id="grandTotal">$0.00</span></div>
        <div class="view-invoice-link">View invoice</div>
    </div>
</div>

<input type="file" id="imgSelector" accept="image/*" style="display:none" onchange="processLocalImage(event)">
<div class="panel-tool"><button class="btn-download-now" onclick="triggerScreenshot()">Download</button></div>

<script>
    function updateTimeline(targetStep) {
        for (let idx = 0; idx < 4; idx++) {
            const nodeElement = document.getElementById("n-" + idx);
            const textElement = document.getElementById("l-" + idx);
            if(!nodeElement) continue;
            nodeElement.className = 'node';
            if(textElement) { textElement.style.fontWeight = 'normal'; textElement.style.color = '#565959'; }
            if (idx === targetStep) {
                nodeElement.classList.add('active-capsule');
                if(textElement) { textElement.style.fontWeight = '700'; textElement.style.color = '#0f1111'; }
            } else if (idx < targetStep) { nodeElement.classList.add('passed-check'); }
        }
    }
    function cleanPrice(rawStr) { let filtered = rawStr.replace(/[^0-9.-]/g, ''); let parsed = parseFloat(filtered); return isNaN(parsed) ? 0 : parsed; }
    function toUSD(numValue) { return '$' + numValue.toFixed(2); }
    function reCalculateOrder() {
        const itemSub = cleanPrice(document.getElementById('subTotal').innerText);
        const shipping = cleanPrice(document.getElementById('shipTotal').innerText);
        const tax = cleanPrice(document.getElementById('taxTotal').innerText);
        const beforeTax = itemSub + shipping;
        const finalGrand = beforeTax + tax;
        document.getElementById('beforeTaxTotal').innerText = toUSD(beforeTax);
        document.getElementById('grandTotal').innerText = toUSD(finalGrand);
    }
    function setupLiveSync() {
        ['editPrice', 'subTotal', 'shipTotal', 'taxTotal'].forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            el.addEventListener('blur', (e) => { e.target.innerText = toUSD(cleanPrice(e.target.innerText)); reCalculateOrder(); });
            el.addEventListener('input', () => reCalculateOrder());
        });
    }
    function openFileUploader() { document.getElementById('imgSelector').click(); }
    function processLocalImage(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => { document.getElementById('pImg').src = e.target.result; document.getElementById('mImg').src = e.target.result; };
            reader.readAsDataURL(file);
        }
    }
    function triggerScreenshot() {
        const toolbar = document.querySelector('.panel-tool');
        toolbar.style.display = 'none';
        html2canvas(document.getElementById('capture-zone'), {scale: 3, backgroundColor: '#ffffff', useCORS: true}).then(canvas => {
            const link = document.createElement('a');
            link.download = 'amazon_final.jpg';
            link.href = canvas.toDataURL('image/jpeg', 0.95);
            link.click();
            toolbar.style.display = 'flex';
        });
    }
    document.addEventListener('DOMContentLoaded', () => { setupLiveSync(); updateTimeline(0); reCalculateOrder(); });
</script>
</body>
</html>`;

export default function TrackingView({ onBack }: TrackingViewProps) {
  return (
    <div id="tracking-viewport" className="relative h-screen bg-[#040408] text-slate-100 flex flex-col overflow-hidden select-none">
      
      {/* Background cyber grid detail */}
      <div className="absolute inset-0 -z-50 h-full w-full bg-[linear-gradient(to_right,#0c0f1d_1px,transparent_1px),linear-gradient(to_bottom,#0c0f1d_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />
      <div className="absolute top-1/4 left-1/4 -z-40 h-96 w-96 rounded-full bg-cyan-500/5 blur-[120px]" />

      {/* Header frame */}
      <div className="relative flex h-16 shrink-0 items-center justify-between border-b border-white/5 bg-zinc-950/40 px-6 backdrop-blur-md z-10">
        <div className="flex items-center gap-2">
          {/* Back button */}
          <motion.button
            id="tracking-back-btn"
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
          key="amazon-order-frame-tracking"
          id="amazon-order-frame-tracking"
          srcDoc={AMAZON_PENDING_ORDER_TEMPLATE}
          title="Amazon Pending Order Screen"
          sandbox="allow-scripts allow-downloads allow-same-origin allow-modals"
          className="w-full h-full border-none block"
        />
      </div>

    </div>
  );
}
