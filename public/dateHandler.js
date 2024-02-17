// This file is for date helper functions

// Helper functions
function getTodaysDate() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    return today.toISOString().slice(0, 10); // Return 'YYYY-MM-DD'
}

function getTomorrowsDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); 
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.toISOString().slice(0, 10);  // Return 'YYYY-MM-DD'
}

function getFirstDayOfWeek() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 for Sunday, 1 for Monday, etc.
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); 

    const firstDayOfWeek = new Date(today.setDate(diff));
    return firstDayOfWeek.toISOString().slice(0, 10);  // Return 'YYYY-MM-DD'
}

function getFirstDayOfNextWeek() {
    const firstDayOfWeek = getFirstDayOfWeek();
    firstDayOfWeek.setDate(firstDayOfWeek.getDate() + 7); 
    return firstDayOfWeek.toISOString().slice(0, 10);  // Return 'YYYY-MM-DD'
}

function getFirstDayOfMonth() {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return firstDayOfMonth.toISOString().slice(0, 10);  // Return 'YYYY-MM-DD'
}

function getFirstDayOfNextMonth() {
    const today = new Date();
    const firstDayOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    return firstDayOfNextMonth.toISOString().slice(0, 10);  // Return 'YYYY-MM-DD'
}

