import { NextResponse } from 'next/server';

export async function middleware(request) {
  const token = request.cookies.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  try {
    const verifyResponse = await fetch(new URL('/api/verifyToken', request.url), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: token.value }),
    });

    const verifyData = await verifyResponse.json();

    if (verifyData.valid) {
      return NextResponse.next();
    } else {
      const response = NextResponse.redirect(new URL('/', request.url));
      response.cookies.set('token', '', { expires: new Date(0) }); // Apaga o cookie
      return response;
    }
  } catch (error) {
    console.log(error);
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.set('token', '', { expires: new Date(0) }); // Apaga o cookie
    return response;
  }
}

export const config = {
  matcher: ['/dashboard/:path*'],
};