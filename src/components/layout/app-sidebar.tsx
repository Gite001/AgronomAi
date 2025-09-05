
"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarFooter,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  BookOpen,
  History,
  Map,
  Wand2,
  FolderKanban,
  HelpCircle,
  Settings,
  ListTodo,
  Info,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "../icons";

const mainMenuItems = [
  { href: "/dashboard", label: "Tableau de Bord", icon: LayoutDashboard },
  { href: "/journal", label: "Journal de Bord", icon: History },
  { href: "/action-plan", label: "Plan d'Action", icon: ListTodo },
  { href: "/map", label: "Cartographie", icon: Map },
];

const knowledgeItems = [
    { href: "/guides", label: "Guides & Savoirs", icon: BookOpen },
    { href: "/case-studies", label: "Études de Cas", icon: FolderKanban },
    { href: "/user-guide", label: "Guide d'Utilisation", icon: HelpCircle },
]

export function AppSidebar() {
  const pathname = usePathname();
  const { setOpenMobile, isMobile } = useSidebar();

  const isActive = (href: string) => pathname === href || (href !== '/dashboard' && href !== '/guides' && href !== '/tools/accueil' && pathname.startsWith(href));
  
  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2">
            <Logo className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden">AgronomAi</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          <SidebarGroup className="p-0">
                <SidebarMenu className="pt-1">
                    {mainMenuItems.map((item) =>(
                        <SidebarMenuItem key={item.href}>
                        <Link href={item.href!} passHref onClick={handleLinkClick}>
                        <SidebarMenuButton isActive={isActive(item.href!)} tooltip={item.label}>
                            <item.icon />
                            <span>{item.label}</span>
                        </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroup>

            <SidebarSeparator/>
            
            <SidebarGroup className="p-0">
                <SidebarMenu className="pt-1">
                     <SidebarMenuItem>
                        <Link href="/tools/accueil" passHref onClick={handleLinkClick}>
                            <SidebarMenuButton isActive={pathname.startsWith('/tools')}>
                                <Wand2 />
                                <span>Nos Outils IA</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroup>

            <SidebarSeparator/>

             <SidebarGroup className="p-0">
                <SidebarMenu className="pt-1">
                    {knowledgeItems.map((item) =>(
                        <SidebarMenuItem key={item.href}>
                        <Link href={item.href!} passHref onClick={handleLinkClick}>
                        <SidebarMenuButton isActive={isActive(item.href!)} tooltip={item.label}>
                            <item.icon />
                            <span>{item.label}</span>
                        </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroup>

        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
                <Link href="/about" passHref onClick={handleLinkClick}>
                    <SidebarMenuButton isActive={isActive('/about')} tooltip="À Propos">
                        <Info />
                        <span>À Propos</span>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <Link href="/settings" passHref onClick={handleLinkClick}>
                    <SidebarMenuButton isActive={isActive('/settings')} tooltip="Settings">
                        <Settings />
                        <span>Paramètres</span>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
