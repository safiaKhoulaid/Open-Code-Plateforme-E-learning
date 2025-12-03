<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
    use HasFactory;

    const STATUS_PENDING = 'PENDING';
    const STATUS_COMPLETED = 'COMPLETED';
    const STATUS_CANCELLED = 'CANCELLED';
    const STATUS_FAILED = 'FAILED';
    const STATUS_REFUNDED = 'REFUNDED';

    protected $fillable = [
        'user_id',
        'total_amount',
        'discount',
        'tax',
        'final_amount',
        'status',
        'payment_method',
        'billing_address',
        'created_date'
    ];

    protected $casts = [
        'total_amount' => 'float',
        'discount' => 'float',
        'tax' => 'float',
        'final_amount' => 'float',
        'created_date' => 'datetime',
        'billing_address' => 'json'
    ];

    /**
     * Obtenir l'utilisateur qui a passé la commande
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Obtenir les éléments de la commande
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Obtenir le paiement associé à la commande
     */
    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }

    /**
     * Obtenir la facture associée à la commande
     */
    public function invoice(): HasOne
    {
        return $this->hasOne(Invoice::class);
    }
}
