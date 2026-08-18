// Pages/ChatPage.tsx
import React, { useState } from 'react';
import type { PageProps, UserProfile } from '../types';

interface ChatRoom {
    id: string;
    name: string;
    isGroup: boolean;
    members: string[]; // List of user identifiers or names
    creatorIdentifier: string; // Identifier of the officer who created the chat
}

// Mock database of all officers available to add to custom chats
const ALL_OFFICERS: UserProfile[] = [
    { identifier: 'char_1001', name: 'John Miller', callsign: '#1001', job_grade: 10, mdt_active: true },
    { identifier: 'char_1042', name: 'Dumont Wilde', callsign: '#1042', job_grade: 10, mdt_active: true },
    { identifier: 'char_2041', name: 'Sarah Jensen', callsign: '#2041', job_grade: 5, mdt_active: true },
    { identifier: 'char_3012', name: 'Lars Thomsen', callsign: '#3012', job_grade: 2, mdt_active: true },
];

interface ChatMessage {
    id: string;
    roomId: string;
    sender: string;
    callsign: string;
    text: string;
    time: string;
}

export const ChatPage: React.FC<PageProps> = ({ currentUser }) => {
    // Rooms state
    const [rooms, setRooms] = useState<ChatRoom[]>([
        { id: 'all-staff', name: 'Alle ansatte', isGroup: false, members: [], creatorIdentifier: 'system' }
    ]);
    const [activeRoomId, setActiveRoomId] = useState<string>('all-staff');

    // Modal state for creating new chat / adding members
    const [isCreatingModalOpen, setIsCreatingModalOpen] = useState(false);
    const [newChatName, setNewChatName] = useState('');

    // Modal state for managing members of active custom chat
    const [isManageMembersOpen, setIsManageMembersOpen] = useState(false);

    // Messages state
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            roomId: 'all-staff',
            sender: 'John Miller',
            callsign: '#1001',
            text: 'All units report your current sector status.',
            time: '10:00'
        },
        {
            id: '2',
            roomId: 'all-staff',
            sender: 'Dumont Wilde',
            callsign: '#1042',
            text: 'Unit 1 clear in sector 4. Patrolling normally.',
            time: '10:02'
        }
    ]);

    const [inputText, setInputText] = useState('');

    const activeRoom = rooms.find(r => r.id === activeRoomId) || rooms[0];

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const newMessage: ChatMessage = {
            id: Date.now().toString(),
            roomId: activeRoom.id,
            sender: currentUser.name,
            callsign: currentUser.callsign,
            text: inputText.trim(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, newMessage]);
        setInputText('');
    };

    const handleCreateChat = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newChatName.trim()) return;

        const newId = `room-${Date.now()}`;
        const newRoom: ChatRoom = {
            id: newId,
            name: newChatName.trim(),
            isGroup: true,
            members: [currentUser.identifier], // Creator starts inside
            creatorIdentifier: currentUser.identifier
        };

        setRooms([...rooms, newRoom]);
        setActiveRoomId(newId);
        setNewChatName('');
        setIsCreatingModalOpen(false);
    };

    const handleDeleteChat = (roomId: string) => {
        const remainingRooms = rooms.filter(r => r.id !== roomId);
        setRooms(remainingRooms);
        // Remove associated messages as well
        setMessages(messages.filter(m => m.roomId !== roomId));
        // Switch back to default chat
        setActiveRoomId('all-staff');
        setIsManageMembersOpen(false);
    };

    const toggleMemberInActiveChat = (officerIdentifier: string) => {
        setRooms(rooms.map(room => {
            if (room.id === activeRoom.id) {
                const exists = room.members.includes(officerIdentifier);
                const updatedMembers = exists
                    ? room.members.filter(m => m !== officerIdentifier)
                    : [...room.members, officerIdentifier];
                return { ...room, members: updatedMembers };
            }
            return room;
        }));
    };

    const currentRoomMessages = messages.filter(m => m.roomId === activeRoom.id);
    const isCreator = activeRoom.isGroup && activeRoom.creatorIdentifier === currentUser.identifier;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', position: 'relative' }}>
            <div>
                <h2 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 4px 0' }}>Intern chat</h2>
                <p style={{ color: 'var(--slate-11, #94949e)', fontSize: '13px', margin: 0 }}>Secure department communication channels & direct chat groups.</p>
            </div>

            {/* Main Chat Layout Container splitting Sidebar and Active Chat Box */}
            <div style={{ flex: 1, display: 'flex', gap: '16px', minHeight: '400px', overflow: 'hidden' }}>

                {/* Rooms Sidebar */}
                <div style={{ width: '260px', background: 'var(--slate-3)', border: '1px solid var(--slate-6)', borderRadius: '6px', display: 'flex', flexDirection: 'column', padding: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '0 4px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--slate-11)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Samtalekanaler</span>
                        <button
                            onClick={() => setIsCreatingModalOpen(true)}
                            title="Opret ny chat"
                            style={{ background: 'var(--indigo-9)', color: 'white', border: 'none', borderRadius: '4px', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}
                        >
                            <i className="fa-solid fa-plus"></i>
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto', flex: 1 }} className="mdt-scrollbar">
                        {rooms.map(room => {
                            const isActive = room.id === activeRoomId;
                            return (
                                <button
                                    key={room.id}
                                    onClick={() => setActiveRoomId(room.id)}
                                    style={{
                                        textAlign: 'left',
                                        padding: '10px 12px',
                                        background: isActive ? 'var(--indigo-4)' : 'transparent',
                                        color: isActive ? 'var(--indigo-11)' : 'var(--slate-12)',
                                        border: isActive ? '1px solid var(--indigo-6)' : '1px solid transparent',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '13px',
                                        fontWeight: isActive ? 600 : 400,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                                        <i className={`fa-solid ${room.id === 'all-staff' ? 'fa-globe' : 'fa-users'}`} style={{ fontSize: '12px', color: isActive ? 'var(--indigo-11)' : 'var(--slate-11)' }}></i>
                                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{room.name}</span>
                                    </div>
                                    {room.isGroup && (
                                        <span style={{ fontSize: '10px', background: 'var(--slate-5)', padding: '2px 6px', borderRadius: '10px', color: 'var(--slate-11)' }}>
                                            {room.members.length}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Chat Window Panel */}
                <div style={{ flex: 1, background: 'var(--slate-3)', border: '1px solid var(--slate-6)', borderRadius: '6px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}>

                    {/* Chat Header Header info / manage group button if custom room */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--slate-6)', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className={`fa-solid ${activeRoom.id === 'all-staff' ? 'fa-globe' : 'fa-users'}`} style={{ color: 'var(--indigo-11)', fontSize: '14px' }}></i>
                            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--slate-12)' }}>{activeRoom.name}</span>
                        </div>
                        {activeRoom.isGroup && (
                            <button
                                onClick={() => setIsManageMembersOpen(true)}
                                style={{ background: 'var(--slate-4)', border: '1px solid var(--slate-6)', color: 'var(--slate-12)', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', fontWeight: 500 }}
                            >
                                <i className="fa-solid fa-user-plus" style={{ marginRight: '6px' }}></i> Administrer medlemmer ({activeRoom.members.length})
                            </button>
                        )}
                    </div>

                    {/* Messages feed */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', marginBottom: '20px', flex: 1 }} className="mdt-scrollbar">
                        {currentRoomMessages.length === 0 ? (
                            <div style={{ textAlign: 'center', color: 'var(--slate-11)', fontSize: '13px', margin: 'auto' }}>
                                Ingen beskeder i denne chat endnu. Skriv den første besked nedenfor.
                            </div>
                        ) : (
                            currentRoomMessages.map((msg) => {
                                const isSelf = msg.sender === currentUser.name;
                                return (
                                    <div
                                        key={msg.id}
                                        style={{
                                            background: isSelf ? 'var(--indigo-4)' : 'var(--slate-4)',
                                            padding: '12px 16px',
                                            borderRadius: isSelf ? '6px 6px 2px 6px' : '6px 6px 6px 2px',
                                            maxWidth: '70%',
                                            alignSelf: isSelf ? 'flex-end' : 'flex-start',
                                            border: isSelf ? '1px solid var(--indigo-6)' : '1px solid var(--slate-6)'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '4px' }}>
                                            <div style={{ fontSize: '11px', color: isSelf ? 'var(--amber-9)' : 'var(--indigo-11)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                {msg.sender} ({msg.callsign})
                                            </div>
                                            <div style={{ fontSize: '10px', color: 'var(--slate-11)' }}>{msg.time}</div>
                                        </div>
                                        <div style={{ fontSize: '13px', color: 'var(--slate-12)', lineHeight: '1.4' }}>{msg.text}</div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Input message form */}
                    <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '12px' }}>
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder={`Skriv besked i ${activeRoom.name}...`}
                            style={{ flex: 1, background: 'var(--slate-2)', border: '1px solid var(--slate-6)', borderRadius: '4px', padding: '12px 16px', color: 'var(--slate-12)', fontSize: '13px', outline: 'none' }}
                        />
                        <button
                            type="submit"
                            style={{ background: 'var(--indigo-9)', color: 'white', border: 'none', borderRadius: '4px', padding: '0 24px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
                        >
                            Send
                        </button>
                    </form>
                </div>

            </div>

            {/* Modal: Opret ny chat */}
            {isCreatingModalOpen && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <div style={{ background: 'var(--slate-3)', border: '1px solid var(--slate-6)', borderRadius: '8px', padding: '24px', width: '380px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
                        <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 600, color: 'var(--slate-12)' }}>Opret ny samtalekanal</h3>
                        <p style={{ fontSize: '13px', color: 'var(--slate-11)', margin: '0 0 16px 0' }}>Giv din chatgruppe et navn. Du vil være eneste medlem ved opstart og kan tilføje andre bagefter.</p>

                        <form onSubmit={handleCreateChat}>
                            <input
                                type="text"
                                placeholder="F.x. Operation Sundown"
                                value={newChatName}
                                onChange={(e) => setNewChatName(e.target.value)}
                                autoFocus
                                style={{ width: '100%', background: 'var(--slate-2)', border: '1px solid var(--slate-6)', borderRadius: '4px', padding: '10px 12px', color: 'var(--slate-12)', fontSize: '13px', outline: 'none', marginBottom: '20px', boxSizing: 'border-box' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                <button
                                    type="button"
                                    onClick={() => setIsCreatingModalOpen(false)}
                                    style={{ background: 'var(--slate-5)', border: '1px solid var(--slate-6)', color: 'var(--slate-12)', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
                                >
                                    Annuller
                                </button>
                                <button
                                    type="submit"
                                    style={{ background: 'var(--indigo-9)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
                                >
                                    Opret
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Administrer medlemmer & Slet chat (hvis ejer) */}
            {isManageMembersOpen && activeRoom.isGroup && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <div style={{ background: 'var(--slate-3)', border: '1px solid var(--slate-6)', borderRadius: '8px', padding: '24px', width: '420px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 600, color: 'var(--slate-12)' }}>Administrer medlemmer</h3>
                        <p style={{ fontSize: '13px', color: 'var(--slate-11)', margin: '0 0 16px 0' }}>Tilføj eller fjern betjente fra "{activeRoom.name}".</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto', marginBottom: '20px' }} className="mdt-scrollbar">
                            {ALL_OFFICERS.map(officer => {
                                const isMember = activeRoom.members.includes(officer.identifier);
                                return (
                                    <div
                                        key={officer.identifier}
                                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--slate-4)', padding: '10px 12px', borderRadius: '4px', border: '1px solid var(--slate-6)' }}
                                    >
                                        <div>
                                            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--slate-12)' }}>{officer.name}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--slate-11)' }}>{officer.callsign}</div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => toggleMemberInActiveChat(officer.identifier)}
                                            style={{
                                                background: isMember ? 'var(--crimson-9, #dc2626)' : 'var(--indigo-9)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                padding: '6px 12px',
                                                fontSize: '12px',
                                                cursor: 'pointer',
                                                fontWeight: 500
                                            }}
                                        >
                                            {isMember ? 'Fjern' : 'Tilføj'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Slet chat knap (kunsynlig/aktiverbar for skaberen) */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--slate-6)', paddingTop: '16px' }}>
                            {isCreator ? (
                                <button
                                    type="button"
                                    onClick={() => handleDeleteChat(activeRoom.id)}
                                    style={{ background: 'var(--crimson-9, #dc2626)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
                                >
                                    Slet chatkanal
                                </button>
                            ) : (
                                <span style={{ fontSize: '12px', color: 'var(--slate-11)' }}>Kun opretteren kan slette denne chat.</span>
                            )}

                            <button
                                type="button"
                                onClick={() => setIsManageMembersOpen(false)}
                                style={{ background: 'var(--indigo-9)', border: 'none', color: 'white', padding: '8px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
                            >
                                Færdig
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};