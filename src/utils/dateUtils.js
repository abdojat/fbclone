// src/utils/dateUtils.js

import { format } from 'date-fns';

/**
 * Formats an ISO timestamp (or Date) as “MMM d, yyyy h:mm a”
 * e.g. formatDateTime('2025-05-29T13:45:00Z') → "May 29, 2025 1:45 PM"
 */
export function formatDateTime(timestamp) {
    try {
        return format(new Date(timestamp), 'MMM d, yyyy h:mm a');
    } catch {
        return '';
    }
}

/**
 * Formats an ISO timestamp (or Date) as “MMM d, yyyy”
 * e.g. formatDate('2025-05-29T13:45:00Z') → "May 29, 2025"
 */
export function formatDate(timestamp) {
    try {
        return format(new Date(timestamp), 'MMM d, yyyy');
    } catch {
        return '';
    }
}

/**
 * Formats just the time portion as “h:mm a”
 * e.g. formatTime('2025-05-29T13:45:00Z') → "1:45 PM"
 */
export function formatTime(timestamp) {
    try {
        return format(new Date(timestamp), 'h:mm a');
    } catch {
        return '';
    }
}

/**
 * Formats a timestamp for chat/message display:
 * - Today: 'Today, h:mm a'
 * - Yesterday: 'Yesterday, h:mm a'
 * - Else: 'MMM d, yyyy h:mm a'
 */
export function formatChatDate(timestamp) {
    try {
        const date = new Date(timestamp);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        const isYesterday = date.toDateString() === yesterday.toDateString();
        if (isToday) {
            return `Today, ${format(date, 'h:mm a')}`;
        } else if (isYesterday) {
            return `Yesterday, ${format(date, 'h:mm a')}`;
        } else {
            return format(date, 'MMM d, yyyy h:mm a');
        }
    } catch {
        return '';
    }
}
