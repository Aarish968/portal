export const dashboardStyles = `
  /* Global container fix */
  * {
    box-sizing: border-box !important;
  }
  
  body, html {
    overflow-x: hidden !important;
    max-width: 100vw !important;
    width: 100% !important;
  }
  
  /* Prevent horizontal overflow on all containers */
  .min-h-screen {
    max-width: 100vw !important;
    overflow-x: hidden !important;
  }
  
  /* Mobile tabs responsive fixes */
  /* Very small screens - 354px and below */
  @media (max-width: 354px) {
    .mobile-tabs {
      gap: 0.188rem !important;
      overflow-x: auto !important;
      overflow-y: hidden !important;
      -webkit-overflow-scrolling: touch !important;
      scrollbar-width: none !important;
      -ms-overflow-style: none !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
    .mobile-tabs::-webkit-scrollbar {
      display: none !important;
    }
    .mobile-tabs button {
      font-size: 0.563rem !important;
      padding: 0.125rem 0.25rem !important;
      flex-shrink: 0 !important;
      letter-spacing: -0.02em !important;
    }
  }
  
  /* Small screens - 355px to 377px */
  @media (min-width: 355px) and (max-width: 377px) {
    .mobile-tabs {
      gap: 0.5rem !important;
    }
    .mobile-tabs button {
      font-size: 0.75rem !important;
    }
  }
  
  @media (min-width: 378px) and (max-width: 389px) {
    .mobile-tabs {
      gap: 0.625rem !important;
    }
    .mobile-tabs button {
      font-size: 0.813rem !important;
    }
  }
  
  @media (min-width: 390px) and (max-width: 454px) {
    .mobile-tabs {
      gap: 0.75rem !important;
    }
    .mobile-tabs button {
      font-size: 0.875rem !important;
    }
  }
  
  /* Extra small mobile (up to 22.125rem / 354px) - Reduce header text */
  @media (max-width: 22.125rem) {
    .mobile-header {
      left: 12.3rem !important;
      right: 0 !important;
      z-index: 50 !important;
      position: fixed !important;
      margin-left: 0 !important;
      padding-left: 0.25rem !important;
      padding-right: 0.25rem !important;
      width: calc(100vw - 12.3rem) !important;
      max-width: calc(100vw - 12.3rem) !important;
      box-sizing: border-box !important;
    }
    
    /* Reduce tabs container padding */
    .mobile-header > div {
      padding-left: 0.25rem !important;
      padding-right: 0.25rem !important;
    }
    
    /* Reduce header text size to prevent height increase */
    .mobile-header h1 {
      font-size: 0.875rem !important;
      line-height: 1.2 !important;
    }
    
    .mobile-header p,
    .mobile-header span {
      font-size: 0.75rem !important;
      line-height: 1.2 !important;
    }
    
    .mobile-header .text-xs {
      font-size: 0.65rem !important;
    }
    
    .mobile-header .text-sm {
      font-size: 0.75rem !important;
    }
    
    .mobile-content {
      margin-top: 13.80rem !important;
      padding-top: 0 !important;
      padding-left: 0.5rem !important;
      padding-right: 0.5rem !important;
      margin-left: 2.4rem !important;
      width: calc(100vw - 12.3rem) !important;
      max-width: calc(100vw - 12.3rem) !important;
      box-sizing: border-box !important;
      overflow-x: hidden !important;
    }
    
    /* Ensure visit details wrap properly on extra small screens */
    .visit-details-mobile {
      flex-wrap: wrap !important;
    }
    
    .visit-details-mobile > div {
      flex: 0 1 auto !important;
      min-width: fit-content !important;
    }
  }
  
  /* Small mobile (22.125rem to 34.375rem / 354px - 550px) - WITH SIDEBAR */
  @media (min-width: 22.125rem) and (max-width: 34.375rem) {
    .mobile-header {
      left: 12.3rem !important;
      right: 0 !important;
      z-index: 50 !important;
      position: fixed !important;
      margin-left: 0 !important;
      padding-left: 0.5rem !important;
      padding-right: 0.5rem !important;
      width: calc(100vw - 12.3rem) !important;
      max-width: calc(100vw - 12.3rem) !important;
      box-sizing: border-box !important;
    }
    
    .mobile-content {
      margin-top: 13.80rem !important;
      padding-top: 0 !important;
      padding-left: 0.5rem !important;
      padding-right: 0.5rem !important;
      margin-left: 2.4rem !important;
      width: calc(100vw - 12.3rem) !important;
      max-width: calc(100vw - 12.3rem) !important;
      box-sizing: border-box !important;
      overflow-x: hidden !important;
    }
    
    /* Force all cards to full width without gaps */
    .mobile-content > * {
      width: 100% !important;
      max-width: 100% !important;
      margin-left: 0 !important;
      margin-right: 0 !important;
      box-sizing: border-box !important;
    }
    
    /* Remove horizontal scroll from flex containers */
    .mobile-content .flex,
    .mobile-content .inline-flex {
      flex-wrap: wrap !important;
      overflow-x: hidden !important;
    }
    
    /* Stack typography cleanly - ONLY for mobile */
    .mobile-content h1,
    .mobile-content h2,
    .mobile-content h3,
    .mobile-content h4,
    .mobile-content p,
    .mobile-content span {
      word-wrap: break-word !important;
      overflow-wrap: break-word !important;
      word-break: break-word !important;
    }
    
    /* Fix consent forms layout on mobile */
    .mobile-content .flex.flex-wrap.gap-6 {
      gap: 1rem !important;
    }
    
    /* Ensure consent badges don't overflow on mobile */
    .mobile-content .inline-flex.items-center.text-white {
      max-width: 90px !important;
      min-width: 85px !important;
      overflow: hidden !important;
      padding: 4px 1rem !important;
      gap: 4px !important;
    }
  }
  
  /* Shared mobile styles (up to 34.375rem / 550px) */
  @media (max-width: 34.375rem) {
    /* Force single column layout on mobile */
    .visits-grid-week {
      display: block !important;
      grid-template-columns: none !important;
      width: 100% !important;
      max-width: 100% !important;
    }
    
    .visits-grid-week > div {
      width: 100% !important;
      max-width: 100% !important;
      margin-bottom: 1rem !important;
      display: block !important;
      box-sizing: border-box !important;
    }
    
    /* Mobile visit card styling */
    .visit-card-mobile {
      width: 100% !important;
      max-width: 100% !important;
      margin-bottom: 1rem !important;
      display: block !important;
    }
    
    /* Mobile visit details - responsive flex wrap */
    .visit-details-mobile {
      display: flex !important;
      flex-wrap: wrap !important;
      align-items: center !important;
      gap: 0.5rem !important;
    }
    
    .visit-details-mobile > div {
      flex: 0 1 auto !important;
      min-width: fit-content !important;
      max-width: 100% !important;
    }
    
    /* Mobile procedure badges - wrap properly */
    .procedures-mobile {
      flex-wrap: wrap !important;
      gap: 0.5rem !important;
    }
    
    /* Mobile header adjustments */
    .mobile-header-content {
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 1rem !important;
    }
    
    /* Mobile tabs */
    .mobile-tabs {
      width: 100% !important;
      justify-content: flex-start !important;
    }
    
    /* Reduce white container padding */
    .white-container {
      padding: 0.75rem !important;
    }
  }
  
  /* Tablet responsive fixes (34.375rem to 64rem / 550px - 1024px) */
  @media (min-width: 34.375rem) and (max-width: 64rem) {
    .mobile-header {
      left: 12.3rem !important;
      right: 0 !important;
      z-index: 50 !important;
      position: fixed !important;
      width: auto !important;
      max-width: calc(100vw - 12rem) !important;
      padding-left: 0rem !important;
      padding-right: 1.5rem !important;
    }
    
    .mobile-content {
      padding-top: 7rem !important;
      padding-left: 3rem !important;
      padding-right: 1.5rem !important;
      margin-left: 1rem !important;
      width: calc(100vw - 12rem) !important;
      max-width: calc(100vw - 12rem) !important;
      box-sizing: border-box !important;
    }
    
    /* Tablet: single column for week view */
    .visits-grid-week {
      display: block !important;
      grid-template-columns: none !important;
      width: 100% !important;
      max-width: 100% !important;
    }
    
    .visits-grid-week > div {
      width: 100% !important;
      max-width: 100% !important;
      margin-bottom: 1rem !important;
      display: block !important;
      box-sizing: border-box !important;
    }
    
    /* Control consent badge width on tablet */
    .inline-flex.items-center.text-white {
      max-width: 95px !important;
      min-width: 90px !important;
      padding: 4px 1rem !important;
      gap: 6px !important;
    }
    
    /* Reset text wrapping for tablet - normal behavior */
    .mobile-content h1,
    .mobile-content h2,
    .mobile-content h3,
    .mobile-content h4,
    .mobile-content p,
    .mobile-content span {
      word-wrap: normal !important;
      overflow-wrap: normal !important;
      word-break: normal !important;
    }
    
    /* Tablet: Make visit details vertical (stacked) */
    .visit-details-mobile {
      display: flex !important;
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 0.375rem !important;
    }
    
    .visit-details-mobile > div {
      width: 100% !important;
      max-width: 100% !important;
      flex: none !important;
    }
    
    /* Tablet: Reduce card padding and spacing */
    .visit-card-content {
      padding: 1rem 1.25rem !important;
    }
    
    .visit-card-content .space-y-4,
    .visit-card-content .space-y-5 {
      gap: 0.75rem !important;
    }
    
    /* Tablet: Reduce gap between header and details */
    .visit-card-content > div > div:first-child {
      gap: 0.5rem !important;
    }
    
    /* Tablet: Reduce spacing in sections */
    .visit-card-content h4 {
      margin-bottom: 0.5rem !important;
    }
    
    /* Tablet: Reduce separator spacing */
    .visit-card-content .border-t {
      margin-top: 0.5rem !important;
      margin-bottom: 0.5rem !important;
    }
    
    /* Tablet: Reduce main content spacing */
    .visit-card-content > div > div {
      gap: 0.75rem !important;
    }
    
    /* Tablet: Reduce header section gap */
    .visit-card-content > div > div:first-child > div {
      gap: 0.5rem !important;
    }
    
    /* Tablet: Optimize visit details section spacing */
    .visit-card-content > div > div:nth-child(2) {
      margin-top: 0.5rem !important;
      margin-bottom: 0.5rem !important;
    }
    
    /* Tablet: Reduce section title margins */
    .visit-card-content h4 {
      margin-top: 0.5rem !important;
      margin-bottom: 0.5rem !important;
    }
    
    /* Tablet: Reduce equipment section spacing */
    .mobile-content > div:first-child {
      margin-bottom: 1rem !important;
    }
    
    /* Tablet: Reduce section title spacing */
    .mobile-content h3 {
      margin-bottom: 0.5rem !important;
    }
  }
  
  /* Desktop: maintain current layout (above 64rem / 1024px) */
  @media (min-width: 64rem) {
    /* Control consent badge width on desktop */
    .inline-flex.items-center.text-white {
      max-width: 100px !important;
      min-width: 95px !important;
      padding: 4px 1rem !important;
      gap: 8px !important;
    }
    .mobile-header {
      left: 12.3rem !important;
      right: 0 !important;
      z-index: 50 !important;
      position: fixed !important;
      width: auto !important;
      max-width: calc(100vw - 12rem) !important;
      padding-left: 0rem !important;
      padding-right: 0rem !important;
    }
    
    .mobile-content {
      padding-top: 10rem !important;
      padding-left: 3rem !important;
      padding-right: 1.5rem !important;
      margin-left: 1rem !important;
      width: calc(100vw - 12rem) !important;
      max-width: calc(100vw - 12rem) !important;
      box-sizing: border-box !important;
    }
    
    .visits-grid-week {
      display: grid !important;
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 1rem !important;
      width: 100% !important;
      max-width: 100% !important;
    }
    
    .visits-grid-week > div {
      width: 100% !important;
      max-width: 100% !important;
      min-height: 100% !important;
      box-sizing: border-box !important;
      overflow: hidden !important;
    }
    
    /* Reset text wrapping for desktop - normal behavior */
    .mobile-content h1,
    .mobile-content h2,
    .mobile-content h3,
    .mobile-content h4,
    .mobile-content p,
    .mobile-content span {
      word-wrap: normal !important;
      overflow-wrap: normal !important;
      word-break: normal !important;
    }
  }
  
  /* Force single column layout for Today's visits on all devices */
  .visits-grid-today {
    display: block !important;
    width: 100% !important;
  }
  
  .visits-grid-today > div {
    width: 100% !important;
    max-width: 100% !important;
    margin-bottom: 1rem !important;
    display: block !important;
  }
  
  /* Date card styling - simplified like old code */
  .date-card {
    background-color: rgb(247, 252, 255) !important;
    border: 1px solid rgb(232, 244, 253) !important;
    color: #239BCF !important;
    margin-bottom: 0 !important;
    backdrop-filter: blur(8px) !important;
  }
  
  /* Date card wrapper */
  .date-card-wrapper {
    position: relative !important;
    width: 100% !important;
    min-height: fit-content !important;
  }
  
  /* Visit card content improvements */
  .visit-card-content {
    overflow: hidden !important;
    word-wrap: break-word !important;
  }
  
  /* Responsive text and spacing */
  @media (max-width: 34.375rem) {
    .visit-card-content {
      padding: 0.75rem !important;
    }
    
    .visit-card-content h3 {
      font-size: 0.95rem !important;
      line-height: 1.25 !important;
    }
    
    .visit-card-content .text-sm {
      font-size: 0.8rem !important;
    }
    
    .visit-card-content .text-xs {
      font-size: 0.7rem !important;
    }
  }
  
  /* Equipment section mobile fixes */
  @media (max-width: 34.375rem) {
    .equipment-header {
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 0.75rem !important;
    }
    
    .equipment-stats {
      width: 100% !important;
      justify-content: space-between !important;
    }
  }
  
  /* Additional overflow prevention for all screen sizes */
  .date-section-container,
  .white-container,
  .visits-section-container {
    max-width: 100% !important;
    overflow-x: hidden !important;
    box-sizing: border-box !important;
  }
  
  /* Ensure cards don't overflow */
  .bg-white.rounded-lg {
    max-width: 100% !important;
    box-sizing: border-box !important;
  }
  
  /* Fix for very small screens */
  @media (max-width: 389px) {
    .visit-card-content {
      padding: 0.75rem !important;
    }
    
    .text-sm {
      font-size: 0.8rem !important;
    }
    
    .text-xs {
      font-size: 0.7rem !important;
    }
  }
`
