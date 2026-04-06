/* eslint-disable @typescript-eslint/no-explicit-any */
import { connectDB } from "@/lib/mongodb";
import { Log } from "@/models/Log";
import { ArrowLeft, Clock, User, Tag, Activity } from "lucide-react";
import Link from "next/link";

export default async function LogsPage() {
  await connectDB();
  const logs = await Log.find().sort({ createdAt: -1 }).limit(100).lean();

  // Helper untuk warna badge berdasarkan aksi
  const getActionStyle = (action: string) => {
    switch (action) {
      case 'CREATE_PRODUCT': return 'bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-500/30';
      case 'UPDATE_STOCK': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-500/30';
      case 'DELETE_PRODUCT': return 'bg-red-500/10 text-red-600 border-red-200 dark:border-red-500/30';
      case 'CREATE_CATEGORY': return 'bg-purple-500/10 text-purple-600 border-purple-200 dark:border-purple-500/30';
      default: return 'bg-slate-500/10 text-slate-600 border-slate-200';
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER & NAVIGATION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="p-2.5 rounded-xl border border-border bg-card hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-3xl font-black tracking-tighter flex items-center gap-2">
                <Activity className="text-primary" /> Log Aktivitas
              </h1>
              <p className="text-sm text-muted-foreground font-medium">Riwayat lengkap operasional gudang.</p>
            </div>
          </div>
          
          <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground bg-muted/50 px-4 py-2 rounded-full border border-border">
            Total {logs.length} Records
          </div>
        </div>

        {/* LOGS TABLE / LIST */}
        <div className="rounded-[2rem] border border-border bg-card shadow-xl shadow-black/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              {/* Table Header - Hidden on Mobile */}
              <thead className="hidden md:table-header-group bg-muted/30">
                <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground border-b border-border">
                  <th className="p-6">Waktu & Admin</th>
                  <th className="p-6">Aksi</th>
                  <th className="p-6">Objek</th>
                  <th className="p-6">Keterangan</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-border">
                {logs.length > 0 ? (
                  logs.map((log: any) => (
                    <tr key={log._id.toString()} className="group hover:bg-muted/10 transition-all flex flex-col md:table-row p-4 md:p-0">
                      
                      {/* 1. Waktu & Admin (Responsive Stack) */}
                      <td className="md:p-6 md:w-48">
                        <div className="flex md:flex-col items-center md:items-start justify-between gap-1">
                          <div className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                            <Clock size={14} className="text-primary" />
                            {new Date(log.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter flex items-center gap-1">
                            <User size={10} /> {log.admin || "System"}
                          </div>
                          {/* Tanggal Mobile Only */}
                          <div className="md:hidden text-[10px] font-bold text-muted-foreground">
                            {new Date(log.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                          </div>
                        </div>
                      </td>

                      {/* 2. Badge Aksi */}
                      <td className="md:p-6 py-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-wider ${getActionStyle(log.action)}`}>
                          {log.action.replace('_', ' ')}
                        </span>
                      </td>

                      {/* 3. Target Name */}
                      <td className="md:p-6 py-1">
                        <div className="flex items-center gap-2 font-bold text-foreground">
                          <Tag size={14} className="text-muted-foreground" />
                          {log.targetName}
                        </div>
                      </td>

                      {/* 4. Details */}
                      <td className="md:p-6 pt-1 md:pt-6">
                        <p className="text-sm text-muted-foreground leading-relaxed italic">
                          &ldquo;{log.details}&rdquo;
                        </p>
                        {/* Date Desktop Only */}
                        <div className="hidden md:block text-[9px] mt-2 font-bold text-muted-foreground/50 uppercase">
                          {new Date(log.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </div>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-20 text-center text-muted-foreground italic">
                      Belum ada rekaman aktivitas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-8 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/40">
            End of Activity Logs • Auto Refresh Enabled
          </p>
        </div>
      </div>
    </main>
  );
}