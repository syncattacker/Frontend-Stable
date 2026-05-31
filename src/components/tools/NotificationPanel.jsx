"use client";

import React, { useEffect, useState } from "react";
import { ChevronUp, ChevronDown, X, Bell, ArrowLeft } from "lucide-react";
import { useSocket } from "@/sockets/SocketProvider";
import API from "@/utils/axios";

/* ═══════════════════════════════════════════════
   DESIGN TOKENS — matches GoPwnIt system
═══════════════════════════════════════════════ */
const T = {
  bg:      "#0f0f0f",
  surface: "#191919",
  cream:   "#f0ebe0",
  mid:     "#888888",
  muted:   "rgba(255,255,255,0.06)",
  border:  "rgba(255,255,255,0.09)",
  bHover:  "rgba(255,255,255,0.20)",
  /* Notification type colors */
  blue:    "#4a9eda",   /* ANNOUNCEMENT */
  green:   "#5db87a",   /* WAVE-RELEASE  */
  red:     "#c46060",   /* BAN / AI-BAN  */
  /* Role colors */
  yellow:  "#c49a3a",   /* organizer  */
  purple:  "#8b7fd4",   /* creator    */
  orange:  "#c47a3a",   /* moderator  */
  cyan:    "#4ab8c4",   /* system     */
};

/* ── Type → color ── */
const typeColor = (type) =>
  ({ ANNOUNCEMENT: T.blue, HINT: T.cream, BAN: T.red, "AI-BAN": T.red, "WAVE-RELEASE": T.green }[type] || T.mid);

/* ── Role → color ── */
const roleColor = (role) =>
  ({ organizer: T.yellow, creator: T.purple, moderator: T.orange, system: T.cyan }[role] || T.mid);

/* ── Relative timestamp ── */
const formatTimestamp = (ts) => {
  const diffMs    = Date.now() - new Date(ts);
  const diffMins  = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  if (diffMins  < 1)  return "Just now";
  if (diffMins  < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return new Date(ts).toLocaleDateString();
};

/* ═══════════════════════════════════════════════
   GLOBAL CSS — scoped to .np-root
═══════════════════════════════════════════════ */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500&family=Bebas+Neue&display=swap');

  /* ── Positioning ── */
  .np-root { position: fixed; z-index: 50; font-family: 'Outfit', sans-serif; user-select: none; }
  .np-root.np-br { bottom: 16px; right: 16px; }
  .np-root.np-bl { bottom: 16px; left: 16px; }
  .np-root.np-tr { top: 16px; right: 16px; }
  .np-root.np-tl { top: 16px; left: 16px; }

  /* ── Toggle bar ── */
  .np-toggle {
    background: ${T.bg}; border: 1px solid ${T.border};
    padding: 10px 16px;
    display: flex; align-items: center; gap: 12px;
    min-width: 200px; transition: border-color .15s;
  }
  .np-toggle:hover { border-color: ${T.bHover}; }

  /* ── Popup panel ── */
  .np-popup {
    position: absolute; bottom: calc(100% + 8px); right: 0;
    background: ${T.bg}; border: 1px solid ${T.border};
    display: flex; flex-direction: column; overflow: hidden;
    transition: opacity .2s ease, transform .2s ease;
  }
  .np-popup.np-open   { opacity: 1; transform: translateY(0)   scale(1);    pointer-events: all;  }
  .np-popup.np-closed { opacity: 0; transform: translateY(8px) scale(0.97); pointer-events: none; }

  /* ── Sender list rows ── */
  .np-row {
    padding: 12px 16px; border-bottom: 1px solid ${T.muted};
    cursor: pointer; transition: background .12s;
    display: flex; align-items: center; gap: 12px;
  }
  .np-row:last-child { border-bottom: none; }
  .np-row:hover { background: ${T.surface}; }

  /* ── Notification cards ── */
  .np-card { padding: 12px 16px; border-bottom: 1px solid ${T.muted}; }
  .np-card:last-child { border-bottom: none; }
  .np-card.np-unread { background: rgba(255,255,255,0.018); }

  /* ── Type badge ── */
  .np-badge {
    font-size: 8px; letter-spacing: 0.18em; text-transform: uppercase;
    padding: 2px 7px; border: 1px solid; flex-shrink: 0;
  }

  /* ── Icon / back buttons ── */
  .np-ibtn {
    background: none; border: none; cursor: pointer;
    color: ${T.mid}; display: flex; align-items: center;
    transition: color .15s; padding: 2px;
  }
  .np-ibtn:hover { color: ${T.cream}; }

  /* ── Scrollable body ── */
  .np-scroll { overflow-y: auto; flex: 1; }
  .np-scroll::-webkit-scrollbar { width: 3px; }
  .np-scroll::-webkit-scrollbar-track { background: transparent; }
  .np-scroll::-webkit-scrollbar-thumb { background: ${T.border}; }

  /* ── Incoming toast ── */
  .np-toast {
    position: absolute; bottom: calc(100% + 56px); right: 0;
    width: 290px; background: ${T.bg}; border: 1px solid ${T.border};
    padding: 14px 16px;
    animation: np-slide .25s ease-out both;
  }

  /* ── Unread dot ── */
  .np-dot { width: 5px; height: 5px; border-radius: 50%; background: ${T.blue}; flex-shrink: 0; }

  /* ── Unread count pill ── */
  .np-count {
    background: ${T.cream}; color: ${T.bg};
    font-size: 9px; font-weight: 500;
    min-width: 18px; height: 18px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    padding: 0 5px; flex-shrink: 0;
  }

  @keyframes np-slide {
    from { transform: translateX(310px); opacity: 0; }
    to   { transform: translateX(0);     opacity: 1; }
  }
`;

/* ═══════════════════════════════════════════════
   PRIMITIVES
═══════════════════════════════════════════════ */
const Micro = ({ children, style = {} }) => (
  <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: T.mid, ...style }}>
    {children}
  </p>
);

/* accent bar used in section headers */
const AccentBar = ({ color = T.cream }) => (
  <span style={{ display: "block", width: "2px", height: "12px", background: color, flexShrink: 0 }} />
);

/* ═══════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════ */
const NotificationPanel = ({ position = "bottom-right", seasonSlug }) => {
  const { socket } = useSocket();

  const [notifications,        setNotifications]        = useState([]);
  const [isOpen,               setIsOpen]               = useState(false);
  const [selectedPerson,       setSelectedPerson]       = useState(null);
  const [incomingNotification, setIncomingNotification] = useState(null);

  /* ── Initial fetch ── */
  useEffect(() => {
    if (!seasonSlug) return;
    API.get(`/api/v1/seasons/notifications/${seasonSlug}`, { withCredentials: true })
      .then(res => setNotifications(res.data.notifications || []))
      .catch(err => console.error("Failed to fetch notifications:", err));
  }, [seasonSlug]);

  /* ── Socket: join room + live updates ── */
  useEffect(() => {
    if (!socket || !seasonSlug) return;
    const join = () => socket.emit("joinSeason", seasonSlug);
    socket.connected ? join() : socket.once("connect", join);

    const handleNotification = (notification) => {
      if (notification.seasonSlug !== seasonSlug) return;
      setNotifications(prev =>
        prev.some(n => n._id === notification._id) ? prev : [notification, ...prev]
      );
      setIncomingNotification(notification);
      setTimeout(() => setIncomingNotification(null), 5000);
    };

    socket.on("newNotification", handleNotification);
    return () => {
      socket.emit("leaveSeason", seasonSlug);
      socket.off("newNotification", handleNotification);
    };
  }, [socket, seasonSlug]);

  /* ── Socket: rejoin on reconnect ── */
  useEffect(() => {
    if (!socket) return;
    const handleReconnect = () => seasonSlug && socket.emit("joinSeason", seasonSlug);
    socket.on("connect", handleReconnect);
    return () => socket.off("connect", handleReconnect);
  }, [socket, seasonSlug]);

  /* ── Computed ── */
  const groupedNotifications = notifications.reduce((acc, n) => {
    const key = n.from || "System";
    if (!acc[key]) acc[key] = { from: key, notifications: [], unreadCount: 0 };
    acc[key].notifications.push(n);
    if (!n.isRead) acc[key].unreadCount++;
    return acc;
  }, {});

  const totalUnread = notifications.filter(n => !n.isRead).length;

  /* ── Handlers ── */
  const markAsRead = async (notificationId) => {
    setNotifications(prev =>
      prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
    );
    try {
      await API.patch(
        `/api/v1/seasons/notifications/${seasonSlug}/${notificationId}/read`,
        { id: notificationId },
        { withCredentials: true }
      );
      socket?.emit("notificationRead", { _id: notificationId });
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const handlePersonClick = (personKey) => {
    setSelectedPerson(personKey);
    groupedNotifications[personKey].notifications.forEach(n => {
      if (!n.isRead) markAsRead(n._id);
    });
  };

  const closePanel = () => { setIsOpen(false); setSelectedPerson(null); };
  const togglePanel = () => { setIsOpen(o => !o); setSelectedPerson(null); };

  const posClass = {
    "bottom-right": "np-br",
    "bottom-left":  "np-bl",
    "top-right":    "np-tr",
    "top-left":     "np-tl",
  }[position] || "np-br";

  const selectedGroup = selectedPerson ? groupedNotifications[selectedPerson] : null;

  /* ── Render ── */
  return (
    <div className={`np-root ${posClass}`}>
      <style>{CSS}</style>

      {/* ════ INCOMING TOAST ════ */}
      {incomingNotification && (
        <div className="np-toast">
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            {/* Coloured dot */}
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: typeColor(incomingNotification.type), marginTop: "5px", flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "7px" }}>
                <span className="np-badge" style={{ color: typeColor(incomingNotification.type), borderColor: typeColor(incomingNotification.type) + "44" }}>
                  {incomingNotification.type}
                </span>
                <Micro>{incomingNotification.from || "System"}</Micro>
              </div>
              <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: "12px", color: typeColor(incomingNotification.type), lineHeight: 1.55 }}>
                {incomingNotification.message}
              </p>
            </div>
          </div>
        </div>
      )}

      <div style={{ position: "relative" }}>

        {/* ════ POPUP PANEL ════ */}
        <div
          className={`np-popup ${isOpen ? "np-open" : "np-closed"}`}
          style={{
            width:  selectedPerson ? "370px" : "290px",
            height: selectedPerson ? "460px" : "370px",
          }}
        >
          {/* ── Header ── */}
          <div style={{ padding: "13px 16px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            {selectedPerson ? (
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button className="np-ibtn" onClick={() => setSelectedPerson(null)} aria-label="Back">
                  <ArrowLeft size={14} />
                </button>
                <AccentBar color={roleColor(selectedGroup?.from)} />
                <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: "13px", color: roleColor(selectedGroup?.from) }}>
                  {selectedGroup?.from}
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Bell size={13} color={T.mid} />
                <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: "13px", color: T.cream }}>Notifications</p>
              </div>
            )}
            {!selectedPerson && <Micro>{totalUnread} unread</Micro>}
          </div>

          {/* ── Body ── */}
          <div className="np-scroll">
            {!selectedPerson ? (
              /* ── Sender list ── */
              Object.entries(groupedNotifications).length === 0 ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "220px", gap: "12px" }}>
                  <Bell size={18} color={T.border} />
                  <Micro>No notifications yet</Micro>
                </div>
              ) : (
                Object.entries(groupedNotifications).map(([personKey, person]) => (
                  <div key={personKey} className="np-row" onClick={() => handlePersonClick(personKey)}>
                    {/* Role dot */}
                    <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: roleColor(person.from), flexShrink: 0, marginTop: "1px" }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: "13px", color: roleColor(person.from), marginBottom: "3px" }}>
                        {person.from}
                      </p>
                      <Micro>
                        {person.notifications.length} message{person.notifications.length !== 1 ? "s" : ""}
                        {person.unreadCount > 0 && (
                          <span style={{ marginLeft: "6px", color: T.blue }}>· {person.unreadCount} new</span>
                        )}
                      </Micro>
                    </div>
                    {person.unreadCount > 0 && (
                      <div className="np-count">{person.unreadCount}</div>
                    )}
                  </div>
                ))
              )
            ) : (
              /* ── Message detail ── */
              [...(selectedGroup?.notifications || [])]
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .map(notification => (
                  <div key={notification._id} className={`np-card${notification.isRead ? "" : " np-unread"}`}>
                    {/* Type badge + timestamp */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", marginBottom: "8px" }}>
                      <span
                        className="np-badge"
                        style={{ color: typeColor(notification.type), borderColor: typeColor(notification.type) + "40" }}
                      >
                        {notification.type}
                      </span>
                      <Micro>{formatTimestamp(notification.timestamp)}</Micro>
                    </div>

                    {/* Message */}
                    <div style={{ maxHeight: "80px", overflowY: "auto" }}>
                      <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: "12px", color: typeColor(notification.type), lineHeight: 1.6 }}>
                        {notification.message}
                      </p>
                    </div>

                    {/* Unread indicator */}
                    {!notification.isRead && (
                      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
                        <div className="np-dot" />
                      </div>
                    )}
                  </div>
                ))
            )}
          </div>
        </div>

        {/* ════ TOGGLE BAR ════ */}
        <div className="np-toggle">
          {/* Left side — open/close toggle */}
          <button
            onClick={togglePanel}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", flex: 1, padding: 0 }}
            aria-label="Toggle notifications"
          >
            <Bell size={13} color={isOpen ? T.cream : T.mid} style={{ transition: "color .15s", flexShrink: 0 }} />

            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: isOpen ? T.cream : T.mid, whiteSpace: "nowrap", transition: "color .15s" }}>
              Notifications
            </p>

            {totalUnread > 0 && (
              <div className="np-count">{totalUnread > 99 ? "99+" : totalUnread}</div>
            )}

            {isOpen
              ? <ChevronDown size={12} color={T.mid} style={{ flexShrink: 0 }} />
              : <ChevronUp   size={12} color={T.mid} style={{ flexShrink: 0 }} />
            }
          </button>

          <button onClick={closePanel} className="np-ibtn" aria-label="Close notifications">
            <X size={13} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default NotificationPanel;