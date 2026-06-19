import { next } from '@vercel/functions';

const ALLOWED_HOSTNAMES = [
    'xiayan.icu',
    'www.xiayan.icu',
    'xiayan.haitang000.top',
    'localhost',
    '127.0.0.1',
];

function normalizeHostname(hostname) {
    return hostname.toLowerCase();
}

function isAllowedConfiguredHost(hostname) {
    if (ALLOWED_HOSTNAMES.includes(hostname)) {
        return true;
    }

    return hostname.endsWith('.xiayan.icu') || hostname.endsWith('.xiayan.haitang000.top');
}

function isAllowedImageReferer(request) {
    const referer = request.headers.get('referer');

    if (!referer) {
        return false;
    }

    let refererUrl;
    let requestUrl;

    try {
        refererUrl = new URL(referer);
        requestUrl = new URL(request.url);
    } catch {
        return false;
    }

    const refererHost = normalizeHostname(refererUrl.hostname);
    const requestHost = normalizeHostname(requestUrl.hostname);

    return refererHost === requestHost || isAllowedConfiguredHost(refererHost);
}

export const config = {
    matcher: '/image/:path*',
};

export default function middleware(request) {
    if (isAllowedImageReferer(request)) {
        return next();
    }

    return new Response('Forbidden', {
        status: 403,
        headers: {
            'content-type': 'text/plain; charset=utf-8',
            'cache-control': 'no-store',
        },
    });
}
