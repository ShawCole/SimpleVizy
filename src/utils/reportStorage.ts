interface ReportLayout {
    id: string;
    name: string;
    charts: string[]; // Array of chart IDs in order
}

export function saveReportLayout(layout: ReportLayout) {
    const layouts = JSON.parse(localStorage.getItem('reportLayouts') || '[]');
    layouts.push(layout);
    localStorage.setItem('reportLayouts', JSON.stringify(layouts));
}

export function loadReportLayouts(): ReportLayout[] {
    return JSON.parse(localStorage.getItem('reportLayouts') || '[]');
} 