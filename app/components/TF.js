'use client';

/**
 * TooltipField — مكوّن يغلّف أي حقل input/select ويضيف tooltip يظهر عند hover/focus.
 * Usage: <TF tip="اكتب اسم المشترك الرباعي"><input ... /></TF>
 */
export default function TF({ tip, children, style }) {
    if (!tip) return children;
    return (
        <div className="tooltip-field" data-tooltip={tip} style={style}>
            {children}
        </div>
    );
}
