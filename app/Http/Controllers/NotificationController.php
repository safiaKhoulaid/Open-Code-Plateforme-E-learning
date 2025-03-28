<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = auth()->user()->notifications()
            ->orderBy('timestamp', 'desc')
            ->paginate(20);

        return view('notifications.index', compact('notifications'));
    }

    public function markAsRead(Notification $notification)
    {
        $this->authorize('update', $notification);

        $notification->update([
            'is_read' => true
        ]);

        return back()->with('success', 'Notification marquée comme lue.');
    }

    public function markAllAsRead()
    {
        auth()->user()->notifications()
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return back()->with('success', 'Toutes les notifications ont été marquées comme lues.');
    }

    public function destroy(Notification $notification)
    {
        $this->authorize('delete', $notification);

        $notification->delete();

        return back()->with('success', 'Notification supprimée avec succès.');
    }

    public function clearAll()
    {
        auth()->user()->notifications()->delete();

        return back()->with('success', 'Toutes les notifications ont été supprimées.');
    }

    public function getUnreadCount()
    {
        $count = auth()->user()->notifications()
            ->where('is_read', false)
            ->count();

        return response()->json(['count' => $count]);
    }

    public function getLatest()
    {
        $notifications = auth()->user()->notifications()
            ->where('is_read', false)
            ->orderBy('timestamp', 'desc')
            ->take(5)
            ->get();

        return response()->json($notifications);
    }

    public function redirect(Notification $notification)
    {
        $this->authorize('view', $notification);

        if (!$notification->is_read) {
            $notification->update(['is_read' => true]);
        }

        if ($notification->action_url) {
            return redirect($notification->action_url);
        }

        return back();
    }
}
