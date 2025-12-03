<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TagCourse extends Model
{
    use HasFactory;

    /**
     * Le nom de la table associée au modèle.
     *
     * @var string
     */
    protected $table = 'course_tag';

    /**
     * Les attributs qui sont assignables en masse.
     *
     * @var array
     */
    protected $fillable = [
        'course_id',
        'tag_id',
    ];

    /**
     * Indique si le modèle doit être horodaté.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * Obtenir le cours associé.
     */
    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * Obtenir le tag associé.
     */
    public function tag()
    {
        return $this->belongsTo(Tag::class);
    }
}
