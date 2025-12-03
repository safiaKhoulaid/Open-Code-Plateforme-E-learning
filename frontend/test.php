<?php 
class Employee {
    protected $nom ; 
    protected $prenom ;
    protected $salaire ;
   public function __constuctor($nom , $prenom , $salaire){
    $this ->nom = $nom ;
    $this ->prenom = $prenom ;
    $this->salaire = $salaire

    public function calculateSalaire(){
        return $this->salaire;
    }
    public function afficher(){
        return `monsieu {$this->nom} $this->prenom son salaire est {$this->salaire} ` ;
    }
   }
}

class Manager extends Employee{
    private $prime ; 

    public function calculateSalaire(){
        return 
    }

}
