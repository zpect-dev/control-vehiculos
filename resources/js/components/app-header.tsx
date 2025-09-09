import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icon } from '@/components/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { CalendarRange, Car, Droplets, Menu } from 'lucide-react';

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();

    const currentUrl = page.url;
    const isDashboard = page.component === 'Dashboard';

    const matchFichaTecnica = currentUrl.match(/^\/fichaTecnica\/([^/]+)/);
    const placaActual = matchFichaTecnica ? matchFichaTecnica[1] : null;

    const vehiculoNavItems: NavItem[] = placaActual
        ? [
              { title: 'Ficha Técnica', href: `/fichaTecnica/${placaActual}`, icon: Car },
              { title: 'Revisión de Fluidos', href: `/fichaTecnica/${placaActual}/revisionFluidos`, icon: Droplets },
              { title: 'Revisión Semanal', href: `/fichaTecnica/${placaActual}/revisionSemanal`, icon: CalendarRange },
          ]
        : [];

    return (
        <>
            <div className="border-b border-sidebar-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="mx-auto flex h-16 items-center px-4 md:max-w-7xl">
                    {/* Mobile Menu */}
                    <div className="flex items-center lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="mr-2 h-[34px] w-[34px]">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="flex h-full w-64 flex-col items-stretch justify-between bg-sidebar">
                                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                                <SheetHeader className="flex justify-start text-left">
                                    <h2 className="font-semibold">Control de Vehículos</h2>
                                </SheetHeader>
                                <div className="flex h-full flex-1 flex-col space-y-4 p-4">
                                    <div className="flex h-full flex-col justify-between text-sm">
                                        <div className="flex flex-col space-y-2">
                                            {!isDashboard &&
                                                vehiculoNavItems.map((item) => (
                                                    <Link
                                                        key={item.title}
                                                        href={item.href}
                                                        className="flex items-center space-x-2 rounded-md p-2 font-medium transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                                                    >
                                                        {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                                        <span>{item.title}</span>
                                                    </Link>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                        <div className="flex items-center">
                            <Link href="/dashboard" prefetch className="flex items-center">
                                <h2 className="text-xl font-bold tracking-tight text-gray-800 dark:text-white">Control de Vehículos</h2>
                            </Link>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden flex-1 items-center justify-between lg:flex">
                        <div className="flex items-center">
                            <Link href="/dashboard" prefetch className="flex items-center">
                                <h2 className="text-xl font-semibold tracking-tight text-gray-800 dark:text-white">Control de Vehículos</h2>
                            </Link>
                        </div>

                        {!isDashboard && (
                            <div className="flex flex-1 justify-center">
                                <NavigationMenu>
                                    <NavigationMenuList className="flex items-center space-x-2">
                                        {vehiculoNavItems.map((item, index) => (
                                            <NavigationMenuItem key={index}>
                                                <Link
                                                    href={typeof item.href === 'string' ? item.href : item.href.url}
                                                    className={cn(
                                                        navigationMenuTriggerStyle(),
                                                        'flex h-10 items-center rounded-lg px-4 transition-colors duration-200 hover:hover:bg-[#3d9641] dark:hover:bg-gray-800',
                                                        page.url === (typeof item.href === 'string' ? item.href : item.href.url)
                                                            ? 'bg-[#49af4e] font-semibold text-white dark:bg-gray-700 dark:text-gray-50'
                                                            : 'text-gray-600 dark:text-gray-400',
                                                    )}
                                                >
                                                    {item.icon && <Icon iconNode={item.icon} className="mr-2 h-5 w-5" />}
                                                    {item.title}
                                                </Link>
                                            </NavigationMenuItem>
                                        ))}
                                    </NavigationMenuList>
                                </NavigationMenu>
                            </div>
                        )}

                        <div className="flex items-center">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="size-10 rounded-full p-1">
                                        <Avatar className="size-8 overflow-hidden rounded-full">
                                            <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                            <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                                {getInitials(auth.user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end">
                                    <UserMenuContent user={auth.user} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </div>

            {!isDashboard && breadcrumbs.length > 1 && (
                <div className="flex w-full border-b border-sidebar-border/70">
                    <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
