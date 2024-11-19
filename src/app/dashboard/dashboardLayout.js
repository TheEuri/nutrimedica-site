import { Disclosure, Menu } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Cookies from 'js-cookie';

export default function DashboardLayout({ children, pageName, user }) {
  const navigation = [
    { name: 'Início', href: '/dashboard', current: false },
    { name: 'Pacientes', href: '/dashboard/patients', current: false },
    { name: 'Atendimentos', href: '/dashboard/attendance', current: false },
    { name: 'Configurações', href: '/dashboard/settings', current: false },
  ];

  if (user && user.doctor) {
    navigation.push({ name: 'Estatísticas', href: '/dashboard/statistics', current: false });
  }

  const updatedNavigation = navigation.map((item) => ({
    ...item,
    current: item.name === pageName,
  }));

  const userNavigation = [
    { name: 'Sair', href: '#', onClick: handleLogout },
  ];

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }

  function handleLogout() {
    Cookies.remove('token');
    window.location.href = '/';
  }

  return (
    <div className="min-h-full">
      <Disclosure as="nav" className="bg-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="shrink-0">
                <svg className="size-12 fill-white" width="528" height="396" viewBox="0 0 528 396" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M183.442 0.856995C184.387 1.35699 185.143 2.82699 185.696 3.74699C196.551 21.77 206.723 40.223 217.352 58.383C233.567 86.084 250.143 113.613 266.003 141.516C269.106 136.698 271.952 131.748 274.743 126.745C277.829 121.215 280.942 113.843 285.495 109.429C286.941 108.026 288.861 106.958 290.856 106.612C297.872 105.394 305.335 106.627 312.427 106.698C324.034 106.814 335.645 106.571 347.252 106.558C344.965 112.338 341.391 117.509 338.169 122.796C335.086 127.928 332.058 133.093 329.087 138.291L286.352 211.953L273.321 234.524C270.963 238.581 268.219 242.613 266.247 246.864L210.654 152.018L196.283 127.415C192.167 120.31 188.338 113.395 183.563 106.699C181.485 111.077 178.546 115.342 176.09 119.547C171.946 126.645 167.992 134.052 163.385 140.85L90.064 266.585L73.438 295.338C70.471 300.483 67.819 306.91 63.695 311.186C61.246 313.726 57.792 315.305 54.315 315.827C46.3197 317.026 38.0497 317.547 30 317.5C20.0468 317.441 10.0995 316.062 0.1604 316.384C4.2354 307.613 9.9367 298.941 14.8311 290.57L42.8483 242.738L165.827 31.686C171.777 21.467 178.147 11.433 183.442 0.856995Z"/>
                  <path d="M405.277 106.178C408.555 108.176 426.071 140.699 429.535 146.624L495.713 260.24C503.486 273.381 511.165 286.577 518.748 299.829C521.58 304.816 524.948 309.436 527.166 314.749L526.77 314.836C517.344 317.003 497.5 317 497.5 317C497.5 317 481.492 316.797 473.889 315.668C470.356 315.143 468.203 314.626 465.675 311.992C459.464 305.524 454.785 294.933 450.231 287.063L422.769 240.089C417.269 230.627 412.243 220.517 405.745 211.711C399.913 219.886 395.107 228.923 390.177 237.659C385.771 245.384 381.304 253.073 376.777 260.727C358.181 293.076 339.385 325.308 320.388 357.423C317.791 361.796 315.25 366.201 312.766 370.64C309.276 376.949 305.733 385.368 300.459 390.374C298.675 392.067 296.842 393.213 294.425 393.762C287.871 395.25 273 395.129 273 395.129L240.862 394.373C237.944 394.16 234.91 393.773 232.31 392.341C229.822 390.971 228.582 388.916 227.122 386.58C220.968 376.734 215.48 366.294 209.715 356.2L175.505 296.283C171.833 289.849 168.192 283.386 164.417 277.012C161.397 271.911 157.027 266.422 155.423 260.69C154.601 257.757 154.87 255.702 155.907 252.904C158.209 246.691 162.574 241.211 165.935 235.527C171.932 225.304 177.814 215.014 183.579 204.659C185.489 208.556 188.114 212.334 190.319 216.087L244.797 310.55C251.745 322.567 259.208 334.44 265.696 346.705C270.805 336.786 276.996 327.356 282.573 317.693L321.597 250.557C349.665 202.543 376.904 154.007 405.277 106.178Z" />
                </svg>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {updatedNavigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      aria-current={item.current ? 'page' : undefined}
                      className={classNames(
                        item.current ? 'bg-zinc-900 text-white' : 'text-zinc-300 hover:bg-zinc-700 hover:text-white',
                        'rounded-md px-3 py-2 text-sm font-medium',
                      )}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <button
                  type="button"
                  className="relative rounded-full bg-black p-1 text-zinc-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-zinc-800"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon aria-hidden="true" className="size-6" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-black text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-zinc-800">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      {user && user.imageUrl ? (
                        <img alt="" src={user.imageUrl} className="size-8 rounded-full" />
                      ) : (
                        <span className="size-8 rounded-full bg-gray-300" />
                      )}
                    </Menu.Button>
                  </div>
                  <Menu.Items
                    transition
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                    {userNavigation.map((item) => (
                      <Menu.Item key={item.name}>
                        {({ active }) => (
                          <a
                            href={item.href}
                            onClick={item.onClick}
                            className={classNames(active ? 'bg-zinc-100' : '', 'block px-4 py-2 text-sm text-zinc-700')}
                          >
                            {item.name}
                          </a>
                        )}
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Menu>
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              {/* Mobile menu button */}
              <Disclosure.Button className="group relative inline-flex items-center justify-center rounded-md bg-black p-2 text-zinc-400 hover:bg-zinc-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-zinc-800">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className="block size-6 group-data-[open]:hidden" />
                <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-[open]:block" />
              </Disclosure.Button>
            </div>
          </div>
        </div>

        <Disclosure.Panel className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            {updatedNavigation.map((item) => (
              <Disclosure.Button
                key={item.name}
                as="a"
                href={item.href}
                aria-current={item.current ? 'page' : undefined}
                className={classNames(
                  item.current ? 'bg-black/75 text-white' : 'text-zinc-300 hover:bg-zinc-700 hover:text-white',
                  'block rounded-md px-3 py-2 text-base font-medium',
                )}
              >
                {item.name}
              </Disclosure.Button>
            ))}
          </div>
          <div className="border-t border-zinc-700 pb-3 pt-4">
            <div className="flex items-center px-5">
              <div className="shrink-0">
                {user && user.imageUrl ? (
                  <img alt="" src={user.imageUrl} className="size-10 rounded-full" />
                ) : (
                  <span className="size-10 rounded-full bg-gray-300" />
                )}
              </div>
              <div className="ml-3">
                <div className="text-base/5 font-medium text-white">{user ? user.name : 'Usuário'}</div>
                <div className="text-sm font-medium text-zinc-400">{user ? user.email : 'email@example.com'}</div>
              </div>
              <button
                type="button"
                className="relative ml-auto shrink-0 rounded-full bg-black p-1 text-zinc-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-zinc-800"
              >
                <span className="absolute -inset-1.5" />
                <span className="sr-only">View notifications</span>
                <BellIcon aria-hidden="true" className="size-6" />
              </button>
            </div>
            <div className="mt-3 space-y-1 px-2">
              {userNavigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  onClick={item.onClick}
                  className="block rounded-md px-3 py-2 text-base font-medium text-zinc-400 hover:bg-zinc-700 hover:text-white"
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </div>
        </Disclosure.Panel>
      </Disclosure>

      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">{pageName}</h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}