const DARK_STYLE_ID = 'uniwa-dark-mode-style';
const DARK_ATTR = 'uniwaDark';

const DARK_CSS = `
html[data-uniwa-dark='true'] {
  color-scheme: dark !important;
  background-color: #121212 !important;
}

html[data-uniwa-dark='true'] body,
html[data-uniwa-dark='true'] main,
html[data-uniwa-dark='true'] .ContentEclass,
html[data-uniwa-dark='true'] #main-content,
html[data-uniwa-dark='true'] .main-content,
html[data-uniwa-dark='true'] .main-container,
html[data-uniwa-dark='true'] .view-content,
html[data-uniwa-dark='true'] .container-fluid,
html[data-uniwa-dark='true'] .col_maincontent_active,
html[data-uniwa-dark='true'] .col_maincontent_active_Homepage,
html[data-uniwa-dark='true'] .background-section,
html[data-uniwa-dark='true'] .bg-white,
html[data-uniwa-dark='true'] .bg-light,
html[data-uniwa-dark='true'] .bg-body {
  background-color: #121212 !important;
  background-image: none !important;
  color: #e0e0e0 !important;
}

html[data-uniwa-dark='true'] body::before,
html[data-uniwa-dark='true'] .ContentEclass::before,
html[data-uniwa-dark='true'] .col_maincontent_active::before {
  background-image: none !important;
  background-color: transparent !important;
}

html[data-uniwa-dark='true'] header,
html[data-uniwa-dark='true'] footer,
html[data-uniwa-dark='true'] .navbar,
html[data-uniwa-dark='true'] .navbar-eclass,
html[data-uniwa-dark='true'] .sidebar,
html[data-uniwa-dark='true'] .left-nav,
html[data-uniwa-dark='true'] .panel,
html[data-uniwa-dark='true'] .card,
html[data-uniwa-dark='true'] .card-body,
html[data-uniwa-dark='true'] .card-header,
html[data-uniwa-dark='true'] .card-footer,
html[data-uniwa-dark='true'] .list-group-item,
html[data-uniwa-dark='true'] .dropdown-menu,
html[data-uniwa-dark='true'] .modal-content,
html[data-uniwa-dark='true'] .accordion-item,
html[data-uniwa-dark='true'] .accordion-button,
html[data-uniwa-dark='true'] .form-wrapper,
html[data-uniwa-dark='true'] .breadcrumb,
html[data-uniwa-dark='true'] .popover,
html[data-uniwa-dark='true'] .offcanvas {
  background-color: #1a1a1a !important;
  color: #e0e0e0 !important;
  border-color: #444444 !important;
}

html[data-uniwa-dark='true'] .table,
html[data-uniwa-dark='true'] .table-default,
html[data-uniwa-dark='true'] table,
html[data-uniwa-dark='true'] thead,
html[data-uniwa-dark='true'] tbody,
html[data-uniwa-dark='true'] tr,
html[data-uniwa-dark='true'] th,
html[data-uniwa-dark='true'] td {
  background-color: #161616 !important;
  color: #e0e0e0 !important;
  border-color: #444444 !important;
}

html[data-uniwa-dark='true'] thead th,
html[data-uniwa-dark='true'] tr.list-header th {
  background-color: #1f1f1f !important;
  color: #e0e0e0 !important;
}

html[data-uniwa-dark='true'] tbody tr:hover td {
  background-color: #202020 !important;
}

html[data-uniwa-dark='true'] h1,
html[data-uniwa-dark='true'] h2,
html[data-uniwa-dark='true'] h3,
html[data-uniwa-dark='true'] h4,
html[data-uniwa-dark='true'] h5,
html[data-uniwa-dark='true'] h6,
html[data-uniwa-dark='true'] strong,
html[data-uniwa-dark='true'] .TextBold,
html[data-uniwa-dark='true'] .title-default {
  color: #e0e0e0 !important;
}

html[data-uniwa-dark='true'] p,
html[data-uniwa-dark='true'] li,
html[data-uniwa-dark='true'] span,
html[data-uniwa-dark='true'] label {
  color: #b0b0b0;
}

html[data-uniwa-dark='true'] small,
html[data-uniwa-dark='true'] .text-muted,
html[data-uniwa-dark='true'] .small-text,
html[data-uniwa-dark='true'] .neutral-500-cl,
html[data-uniwa-dark='true'] .neutral-700-cl {
  color: #888888 !important;
}

html[data-uniwa-dark='true'] a:not(.btn):not(.uniwa-quick-pill):not(.uniwa-mbtn) {
  color: #e0e0e0 !important;
}

html[data-uniwa-dark='true'] a:not(.btn):not(.uniwa-quick-pill):not(.uniwa-mbtn):hover {
  color: #ffffff !important;
}

html[data-uniwa-dark='true'] body input:not([type='checkbox']):not([type='radio']):not([type='submit']):not([type='button']),
html[data-uniwa-dark='true'] body input[type='search'],
html[data-uniwa-dark='true'] body input[type='text'],
html[data-uniwa-dark='true'] body textarea,
html[data-uniwa-dark='true'] body select,
html[data-uniwa-dark='true'] body .form-control,
html[data-uniwa-dark='true'] body .form-select,
html[data-uniwa-dark='true'] body .input-group-text,
html[data-uniwa-dark='true'] body .dataTables_filter input,
html[data-uniwa-dark='true'] body .dataTables_length select,
html[data-uniwa-dark='true'] body .dt-search input,
html[data-uniwa-dark='true'] body .dt-length select {
  background: #1a1a1a !important;
  background-color: #1a1a1a !important;
  color: #e0e0e0 !important;
  border-color: #444444 !important;
}

html[data-uniwa-dark='true'] #leftnav .panel-heading,
html[data-uniwa-dark='true'] #leftnav .panel-title,
html[data-uniwa-dark='true'] #leftnav .panel-title a,
html[data-uniwa-dark='true'] #leftnav .panel-title span,
html[data-uniwa-dark='true'] #leftnav .accordion-button,
html[data-uniwa-dark='true'] .left-nav .panel-title,
html[data-uniwa-dark='true'] .course-menu-header,
html[data-uniwa-dark='true'] .panel-group .panel-heading a {
  color: #b0b0b0 !important;
}

html[data-uniwa-dark='true'] .primary-500-cl,
html[data-uniwa-dark='true'] .primary-600-cl,
html[data-uniwa-dark='true'] .primary-700-cl,
html[data-uniwa-dark='true'] .Neutral-900-cl,
html[data-uniwa-dark='true'] .link-color,
html[data-uniwa-dark='true'] .course-title,
html[data-uniwa-dark='true'] .portfolio-course-count {
  color: #e0e0e0 !important;
}

html[data-uniwa-dark='true'] input::placeholder,
html[data-uniwa-dark='true'] textarea::placeholder {
  color: #888888 !important;
}

html[data-uniwa-dark='true'] .dropdown-item {
  color: #e0e0e0 !important;
}

html[data-uniwa-dark='true'] .dropdown-item:hover,
html[data-uniwa-dark='true'] .dropdown-item:focus,
html[data-uniwa-dark='true'] .list-group-item-action:hover {
  background-color: #262626 !important;
  color: #ffffff !important;
}

html[data-uniwa-dark='true'] .border,
html[data-uniwa-dark='true'] .border-top,
html[data-uniwa-dark='true'] .border-bottom,
html[data-uniwa-dark='true'] .border-start,
html[data-uniwa-dark='true'] .border-end,
html[data-uniwa-dark='true'] hr {
  border-color: #444444 !important;
}

html[data-uniwa-dark='true'] .page-link {
  background-color: #1a1a1a !important;
  color: #e0e0e0 !important;
  border-color: #444444 !important;
}

html[data-uniwa-dark='true'] .page-item.active .page-link {
  background-color: #e0e0e0 !important;
  color: #121212 !important;
  border-color: #e0e0e0 !important;
}

html[data-uniwa-dark='true'] .fc,
html[data-uniwa-dark='true'] .fc-theme-standard td,
html[data-uniwa-dark='true'] .fc-theme-standard th,
html[data-uniwa-dark='true'] .fc-scrollgrid,
html[data-uniwa-dark='true'] .datepicker,
html[data-uniwa-dark='true'] .datepicker-inline,
html[data-uniwa-dark='true'] .datepicker table,
html[data-uniwa-dark='true'] .datepicker table tr td,
html[data-uniwa-dark='true'] .datepicker table tr th,
html[data-uniwa-dark='true'] .cal-month-box,
html[data-uniwa-dark='true'] .cal-month-day,
html[data-uniwa-dark='true'] .cal-row-head,
html[data-uniwa-dark='true'] #cal-header,
html[data-uniwa-dark='true'] [id*='calendar'],
html[data-uniwa-dark='true'] [class*='calendar'],
html[data-uniwa-dark='true'] [class*='Calendar'],
html[data-uniwa-dark='true'] .popover-body,
html[data-uniwa-dark='true'] .popover-header {
  border-color: #444444 !important;
  background-color: #161616 !important;
  color: #e0e0e0 !important;
}

html[data-uniwa-dark='true'] [id*='calendar'] td,
html[data-uniwa-dark='true'] [class*='calendar'] td,
html[data-uniwa-dark='true'] [class*='Calendar'] td {
  color: #b0b0b0 !important;
}

html[data-uniwa-dark='true'] [id*='calendar'] th,
html[data-uniwa-dark='true'] [class*='calendar'] th,
html[data-uniwa-dark='true'] [class*='Calendar'] th {
  color: #e0e0e0 !important;
}

html[data-uniwa-dark='true'] .datepicker table tr td.old,
html[data-uniwa-dark='true'] .datepicker table tr td.new {
  color: #888888 !important;
}

html[data-uniwa-dark='true'] .datepicker table tr td.day:hover,
html[data-uniwa-dark='true'] .datepicker table tr td.focused {
  background-color: #262626 !important;
}

html[data-uniwa-dark='true']::-webkit-scrollbar,
html[data-uniwa-dark='true'] *::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
html[data-uniwa-dark='true']::-webkit-scrollbar-track,
html[data-uniwa-dark='true'] *::-webkit-scrollbar-track {
  background: #121212;
}
html[data-uniwa-dark='true']::-webkit-scrollbar-thumb,
html[data-uniwa-dark='true'] *::-webkit-scrollbar-thumb {
  background: #444444;
  border-radius: 999px;
}
html[data-uniwa-dark='true']::-webkit-scrollbar-thumb:hover,
html[data-uniwa-dark='true'] *::-webkit-scrollbar-thumb:hover {
  background: #888888;
}
`;

function ensureDarkModeStyle() {
  if (document.getElementById(DARK_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = DARK_STYLE_ID;
  style.textContent = DARK_CSS;
  (document.head || document.documentElement).appendChild(style);
}

export function setPageDarkMode(enabled: boolean) {
  ensureDarkModeStyle();
  if (enabled) {
    document.documentElement.dataset[DARK_ATTR] = 'true';
  } else {
    delete document.documentElement.dataset[DARK_ATTR];
  }
}
