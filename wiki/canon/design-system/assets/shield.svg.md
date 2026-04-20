<!-- ═══════════════════════════════════════════════════════════════
     AEGIS Shield — canonical SVG

     Single source of truth for the shield mark. This file is
     documentation, not a module: copy the block that matches your
     context when embedding, and keep the paths identical.

     All variants share:
       viewBox="0 0 44 48"
       stroke="currentColor"
       fill="none"  (outer may take a translucent tint)

     The three variants differ only in stroke-width and decorative
     fill — use them as specified.
     ─────────────────────────────────────────────────────────────── */

== navbar (compact) ========================================
Used in: <nav class="nav"> — 20×22 rendered size, bold line.

  <svg viewBox="0 0 44 48" fill="none">
    <path d="M22 1 L42 6 V24 C42 36 33 44 22 47 C11 44 2 36 2 24 V6 Z"
          stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"
          fill="none"/>
    <path d="M22 11 L30 15.5 V24.5 L22 29 L14 24.5 V15.5 Z"
          stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"
          opacity="0.5"/>
  </svg>


== auth-console (detailed) =================================
Used in: Login.html, Signup.html brand panel — 32×36 rendered size,
lighter line, subtle fill wash (5% foreground on dark), animated dot
overlay supplied by .brand-mark .shield .dot.

  <svg viewBox="0 0 44 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 1 L42 6 V24 C42 36 33 44 22 47 C11 44 2 36 2 24 V6 Z"
          stroke="currentColor" stroke-width="1.25" stroke-linejoin="round"
          fill="oklch(1 0 0 / 0.015)"/>
    <path d="M22 11 L30 15.5 V24.5 L22 29 L14 24.5 V15.5 Z"
          stroke="currentColor" stroke-width="1" stroke-linejoin="round"
          opacity="0.45"/>
  </svg>


== Rules ==================================================
1. Paths are FROZEN. Never modify the d-attribute values. Any new
   shield instance must copy one of the two blocks above verbatim.
2. Only two knobs are allowed to vary:
   - stroke-width (line weight for the context)
   - outer path `fill` (for subtle depth on dark surfaces)
3. Always use stroke="currentColor" so the icon inherits from the
   parent's CSS color — never hard-code a hue.
4. If a new context requires a third variant, add it here FIRST and
   update DESIGN.md §7.
