"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/authSlice";
import API from "@/utils/axios";
import { showToast } from "@/utils/Toast.jsx";

import {
  IconTrophy as IconTrophy,
  IconFlask as IconFlask2,
  IconCalendarEvent as IconCalendarEvent,
  IconArrowUpRight as IconArrowUpRight,
  IconSparkles as IconSparkles,
  IconLogout as IconLogout,
  IconChevronLeft as IconChevronLeft,
  IconUser as IconUser,
} from "@tabler/icons-react";

import logo from "@/img/white.svg";

const T = {
  bg: "#080808",
  surface: "#0a0a0a",
  cream: "#F0EDE6",
  muted: "#888880",
  border: "rgba(255,255,255,0.08)",
  borderHover: "rgba(232,228,217,0.20)",
  active: "rgba(240,237,230,0.06)",
};

const PRIMARY_NAV = [
  { label: "Seasons", href: "/dashboard/seasons", icon: IconTrophy },
  { label: "Labs", href: "/dashboard/labs", icon: IconFlask2 },
];

const TOOLS_NAV = [
  {
    label: "Host Your Season",
    href: "/dashboard/host-your-season",
    icon: IconCalendarEvent,
  },
  {
    label: "Docs",
    href: "https://docs.gopwnit.com",
    icon: IconArrowUpRight,
    external: true,
  },
  { label: "Profile", href: "/profile", icon: IconUser },
];

function NavItem({ label, href, icon: Icon, isActive, collapsed, external }) {
  const inner = (
    <div
      className="relative flex items-center gap-3.5 px-4 py-3 transition-all duration-200 group"
      style={{
        background: isActive ? T.active : "transparent",
        borderLeft: isActive ? `2px solid ${T.cream}` : "2px solid transparent",
        borderBottom: `1px solid ${T.border}`,
      }}
      onMouseEnter={(e) => {
        if (!isActive)
          e.currentTarget.style.background = "rgba(255,255,255,0.02)";
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.background = "transparent";
      }}
    >
      <span
        className="shrink-0 transition-colors duration-200"
        style={{ color: isActive ? T.cream : T.muted }}
      >
        <Icon size={14} strokeWidth={isActive ? 2 : 1.5} />
      </span>

      {!collapsed && (
        <span
          className="text-[10px] font-bold uppercase tracking-[0.18em] font-outfit transition-colors duration-200 truncate"
          style={{ color: isActive ? T.cream : T.muted }}
        >
          {label}
        </span>
      )}

      {!collapsed && external && (
        <span className="ml-auto shrink-0" style={{ color: T.muted }}>
          <IconArrowUpRight size={10} strokeWidth={1.5} />
        </span>
      )}
    </div>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className="block">
      {inner}
    </Link>
  );
}

function SectionLabel({ label, collapsed }) {
  if (collapsed)
    return (
      <div
        style={{ borderBottom: `1px solid ${T.border}`, padding: "8px 0" }}
      />
    );
  return (
    <div className="px-4 pt-5 pb-2">
      <span
        className="text-[9px] font-bold uppercase tracking-[0.28em] font-outfit"
        style={{ color: "rgba(255,255,255,0.2)" }}
      >
        {label}
      </span>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [editableSeasons, setEditableSeasons] = useState([]);
  const [seasonsLoading, setSeasonsLoading] = useState(true);

  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((s) => s.auth.user);

  useEffect(() => {
    const fetchEditableSeasons = async () => {
      try {
        const res = await API.get("/api/v1/seasons/editable");
        if (res.data.success) {
          const all = [...res.data.data.pending, ...res.data.data.approved];
          setEditableSeasons(all);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setSeasonsLoading(false);
      }
    };
    fetchEditableSeasons();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await API.post(
        `${process.env.NEXT_PUBLIC_AUTH_LOGOUT_API}`,
        {},
        { withCredentials: true },
      );
      if (res.data?.success) {
        dispatch(logout());
        showToast("success", res.data.message);
        router.push("/");
      }
    } catch (err) {
      showToast("error", err.response?.data?.message);
    }
  };

  return (
    <div
      className="flex min-h-screen text-white"
      style={{ background: T.surface, fontFamily: "'Outfit', sans-serif" }}
    >
      {/* ── Sidebar ── */}
      <aside
        className="sticky top-0 h-screen flex flex-col shrink-0 overflow-y-auto overflow-x-hidden transition-all duration-400 ease-out"
        style={{
          width: collapsed ? "56px" : "208px",
          background: T.bg,
          borderRight: `1px solid ${T.border}`,
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center justify-center shrink-0 px-3 py-4"
          style={{ borderBottom: `1px solid ${T.border}` }}
        >
          <Image
            src={logo}
            alt="gopwnit"
            width={collapsed ? 40 : 200}
            height={40}
            className="h-[32px] w-auto transition-all duration-300"
            priority
          />
        </div>

        {/* Platform nav */}
        <SectionLabel label="Platform" collapsed={collapsed} />
        <nav>
          {PRIMARY_NAV.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              isActive={
                pathname === item.href || pathname.startsWith(item.href)
              }
              collapsed={collapsed}
            />
          ))}
        </nav>

        {/* Tools nav */}
        <SectionLabel label="Tools" collapsed={collapsed} />
        <nav className="flex-1">
          {TOOLS_NAV.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              isActive={pathname === item.href}
              collapsed={collapsed}
            />
          ))}

          {/* Season Studio */}
          {!seasonsLoading &&
            (editableSeasons.length > 0 ? (
              <>
                <SectionLabel label="Season Studio" collapsed={collapsed} />
                {editableSeasons.map((season) => (
                  <NavItem
                    key={season.slug}
                    label={season.name}
                    href={`/season-studio/${season.slug}`}
                    icon={IconSparkles}
                    isActive={pathname === `/season-studio/${season.slug}`}
                    collapsed={collapsed}
                  />
                ))}
              </>
            ) : (
              <NavItem
                label="Season Studio"
                href="/season-studio"
                icon={IconSparkles}
                isActive={pathname.startsWith("/season-studio")}
                collapsed={collapsed}
              />
            ))}
        </nav>

        {/* Sign out */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 py-3.5 transition-all duration-200 group"
          style={{ borderTop: `1px solid ${T.border}` }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(254, 252, 232, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          <IconLogout
            size={13}
            strokeWidth={1.5}
            className="transition-colors duration-200 group-hover:text-yellow-50"
            style={{ color: T.muted }}
          />
          {!collapsed && (
            <span
              className="text-[10px] font-bold uppercase tracking-[0.2em] font-outfit transition-colors duration-200 group-hover:text-yellow-50"
              style={{ color: T.muted }}
            >
              Sign out
            </span>
          )}
        </button>

        <button
          onClick={() => setCollapsed((v) => !v)}
          className="w-full flex items-center justify-center gap-3 py-3.5 transition-all duration-200 group"
          style={{ borderTop: `1px solid ${T.border}` }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.02)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          <IconChevronLeft
            size={13}
            strokeWidth={2}
            className="transition-all duration-300 group-hover:text-white"
            style={{
              color: T.muted,
              transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
          {!collapsed && (
            <span
              className="text-[10px] font-bold uppercase tracking-[0.2em] font-outfit transition-colors duration-200 group-hover:text-white"
              style={{ color: T.muted }}
            >
              Collapse
            </span>
          )}
        </button>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        {children}
      </div>
    </div>
  );
}
