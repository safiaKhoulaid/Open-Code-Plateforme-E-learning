"use client"

import { useState, useEffect } from "react"
import { useInView } from "react-intersection-observer"
import { Link } from "react-router-dom"

import { motion } from "framer-motion"
import {
  Users,
  BookOpen,
  Award,
  Globe,
  Heart,
  Lightbulb,
  Shield,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Link as LinkIcon,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

const AboutUs = () => {
  const [activeTab, setActiveTab] = useState("mission")
  const [progressValue, setProgressValue] = useState(0)

  // Animation hooks for sections
  const [missionRef, missionInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [statsRef, statsInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [teamRef, teamInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [timelineRef, timelineInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [testimonialsRef, testimonialsInView] = useInView({ threshold: 0.1, triggerOnce: true })

  // Simulate progress loading
  useEffect(() => {
    const timer = setTimeout(() => setProgressValue(100), 500)
    return () => clearTimeout(timer)
  }, [])

  // Company stats
  const stats = [
    { icon: <Users className="h-8 w-8 text-primary" />, value: "500K+", label: "Étudiants" },
    { icon: <BookOpen className="h-8 w-8 text-primary" />, value: "1,200+", label: "Cours" },
    { icon: <Award className="h-8 w-8 text-primary" />, value: "98%", label: "Taux de satisfaction" },
    { icon: <Globe className="h-8 w-8 text-primary" />, value: "120+", label: "Pays" },
  ]

  // Team members
  const teamMembers = [
    {
      name: "Sophie Martin",
      role: "Fondatrice & CEO",
      bio: "Ancienne professeure d'université avec 15 ans d'expérience dans l'éducation en ligne.",
      image: "/placeholder.svg?height=300&width=300",
      social: { linkedin: "#", twitter: "#" },
    },
    {
      name: "Thomas Dubois",
      role: "Directeur Pédagogique",
      bio: "Expert en sciences de l'éducation, spécialisé dans les méthodes d'apprentissage innovantes.",
      image: "/placeholder.svg?height=300&width=300",
      social: { linkedin: "#", twitter: "#" },
    },
    {
      name: "Emma Leclerc",
      role: "Directrice Technique",
      bio: "Ingénieure en informatique passionnée par les technologies éducatives.",
      image: "/placeholder.svg?height=300&width=300",
      social: { linkedin: "#", twitter: "#" },
    },
    {
      name: "Lucas Bernard",
      role: "Responsable Marketing",
      bio: "Spécialiste en marketing digital avec une expertise dans le secteur éducatif.",
      image: "/placeholder.svg?height=300&width=300",
      social: { linkedin: "#", twitter: "#" },
    },
  ]

  // Company timeline
  const timeline = [
    {
      year: "2015",
      title: "Fondation",
      description: "Création de la plateforme avec seulement 10 cours et une vision ambitieuse.",
    },
    {
      year: "2017",
      title: "Première levée de fonds",
      description: "Obtention de 2M€ pour développer notre catalogue de cours et notre technologie.",
    },
    {
      year: "2019",
      title: "Expansion internationale",
      description: "Lancement dans 50 pays et traduction des cours en 15 langues.",
    },
    {
      year: "2021",
      title: "Acquisition majeure",
      description: "Intégration de TechLearn pour renforcer notre offre en programmation et data science.",
    },
    {
      year: "2023",
      title: "Aujourd'hui",
      description: "Plus de 500 000 étudiants et 1 200 cours dans des dizaines de domaines différents.",
    },
  ]

  // Company values
  const values = [
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: "Innovation",
      description: "Nous repoussons constamment les limites de l'apprentissage en ligne.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Accessibilité",
      description: "Nous rendons l'éducation de qualité accessible à tous, partout.",
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Passion",
      description: "Nous sommes passionnés par l'impact positif de l'éducation sur les vies.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Qualité",
      description: "Nous maintenons les plus hauts standards pour tous nos contenus.",
    },
  ]

  // Testimonials
  const testimonials = [
    {
      name: "Marie Dupont",
      role: "Étudiante en reconversion",
      quote:
        "Grâce à cette plateforme, j'ai pu me reconvertir dans le développement web en seulement 6 mois. Les cours sont clairs, pratiques et les instructeurs sont toujours disponibles.",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "Jean Leroy",
      role: "Entrepreneur",
      quote:
        "J'ai utilisé cette plateforme pour former toute mon équipe aux compétences digitales. Le rapport qualité-prix est imbattable et les résultats sont au rendez-vous.",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "Camille Roux",
      role: "Professeure d'université",
      quote:
        "Je recommande cette plateforme à tous mes étudiants. Le contenu est rigoureux, à jour et parfaitement adapté aux besoins du marché actuel.",
      image: "/placeholder.svg?height=80&width=80",
    },
  ]

  // FAQ items
  const faqItems = [
    {
      question: "Comment sont sélectionnés les instructeurs ?",
      answer:
        "Nos instructeurs passent par un processus de sélection rigoureux qui évalue leur expertise dans leur domaine, leur expérience d'enseignement et leur capacité à créer du contenu engageant. Moins de 5% des candidats sont acceptés.",
    },
    {
      question: "Les certificats sont-ils reconnus par les entreprises ?",
      answer:
        "Oui, nos certificats sont reconnus par plus de 2 000 entreprises partenaires. Nous travaillons constamment avec les employeurs pour nous assurer que nos formations répondent aux besoins du marché du travail.",
    },
    {
      question: "Puis-je accéder aux cours hors ligne ?",
      answer:
        "Absolument ! Notre application mobile permet de télécharger les cours pour un apprentissage hors ligne. Vous pouvez ainsi continuer à apprendre même sans connexion internet.",
    },
    {
      question: "Quelle est votre politique de remboursement ?",
      answer:
        "Nous offrons une garantie de satisfaction de 30 jours. Si vous n'êtes pas satisfait d'un cours, vous pouvez demander un remboursement complet dans les 30 jours suivant l'achat.",
    },
  ]

  // Partners logos
  const partners = [
    "/placeholder.svg?height=60&width=120",
    "/placeholder.svg?height=60&width=120",
    "/placeholder.svg?height=60&width=120",
    "/placeholder.svg?height=60&width=120",
    "/placeholder.svg?height=60&width=120",
    "/placeholder.svg?height=60&width=120",
  ]

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/placeholder.svg?height=800&width=1600"
            alt="Background"
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4 px-4 py-1 text-sm font-medium">
              Notre Histoire
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Transformer l'éducation pour un avenir meilleur
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Découvrez comment nous révolutionnons l'apprentissage en ligne depuis 2015, en rendant l'éducation de
              qualité accessible à tous, partout dans le monde.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="rounded-full">
                Découvrir nos cours
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full">
                Rencontrer l'équipe
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path
              fill="currentColor"
              fillOpacity="0.05"
              d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,213.3C1248,235,1344,213,1392,202.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section ref={missionRef} className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={missionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <Badge className="mb-4">Notre Mission</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Démocratiser l'accès à une éducation de qualité</h2>
              <p className="text-muted-foreground mb-6">
                Notre mission est de créer un monde où chacun peut accéder à une éducation de qualité, quel que soit son
                lieu de résidence ou sa situation financière. Nous croyons que l'apprentissage est un droit fondamental
                qui devrait être accessible à tous.
              </p>
              <p className="text-muted-foreground mb-6">
                Chaque jour, nous travaillons à éliminer les barrières à l'éducation en proposant des cours abordables,
                flexibles et de haute qualité dans des dizaines de domaines différents.
              </p>
              <Tabs defaultValue="mission" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="mission">Mission</TabsTrigger>
                  <TabsTrigger value="vision">Vision</TabsTrigger>
                  <TabsTrigger value="impact">Impact</TabsTrigger>
                </TabsList>
                <TabsContent value="mission" className="space-y-4">
                  <h4 className="text-xl font-semibold">Notre mission</h4>
                  <p className="text-muted-foreground">
                    Rendre l'éducation de qualité accessible à tous, partout dans le monde, en supprimant les barrières
                    géographiques, financières et temporelles.
                  </p>
                </TabsContent>
                <TabsContent value="vision" className="space-y-4">
                  <h4 className="text-xl font-semibold">Notre vision</h4>
                  <p className="text-muted-foreground">
                    Un monde où chaque personne peut réaliser son plein potentiel grâce à un apprentissage continu,
                    personnalisé et accessible tout au long de la vie.
                  </p>
                </TabsContent>
                <TabsContent value="impact" className="space-y-4">
                  <h4 className="text-xl font-semibold">Notre impact</h4>
                  <p className="text-muted-foreground">
                    Plus de 500 000 apprenants ont transformé leur vie grâce à nos formations, avec 78% rapportant une
                    amélioration significative de leur carrière.
                  </p>
                </TabsContent>
              </Tabs>
            </div>
            <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="/placeholder.svg?height=500&width=600" 
                alt="Notre mission" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
                <p className="text-white text-xl font-medium">
                  "L'éducation est l'arme la plus puissante pour changer le monde."
                </p>
                <p className="text-white/80 mt-2">— Nelson Mandela</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
            className="text-center mb-12"
          >
            <Badge variant="outline" className="mb-4">
              Nos Chiffres
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">L'impact de notre plateforme en chiffres</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Depuis notre création, nous avons aidé des centaines de milliers d'apprenants à transformer leur vie grâce
              à l'éducation en ligne.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-xl p-6 shadow-sm border border-border flex flex-col items-center"
              >
                <div className="mb-4 p-3 bg-primary/10 rounded-full">{stat.icon}</div>
                <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 bg-card rounded-xl p-8 border border-border">
            <h3 className="text-xl font-semibold mb-4">Notre croissance</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Étudiants</span>
                  <span className="text-sm text-muted-foreground">500,000+</span>
                </div>
                <Progress value={progressValue} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Cours</span>
                  <span className="text-sm text-muted-foreground">1,200+</span>
                </div>
                <Progress value={progressValue} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Instructeurs</span>
                  <span className="text-sm text-muted-foreground">350+</span>
                </div>
                <Progress value={progressValue} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Pays</span>
                  <span className="text-sm text-muted-foreground">120+</span>
                </div>
                <Progress value={progressValue} className="h-2" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section ref={teamRef} className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={teamInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4">Notre Équipe</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Les visionnaires derrière notre plateforme</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Notre équipe est composée d'experts passionnés par l'éducation et la technologie, unis par la mission de
              transformer l'apprentissage en ligne.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={teamInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{member.name}</CardTitle>
                    <CardDescription className="text-primary font-medium">{member.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{member.bio}</p>
                  </CardContent>
                  <CardFooter className="flex gap-4">
                    {member.social.linkedin && (
                      <Link
                        to={member.social.linkedin}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Linkedin className="h-5 w-5" />
                      </Link>
                    )}
                    {member.social.twitter && (
                      <Link
                        to={member.social.twitter}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Twitter className="h-5 w-5" />
                      </Link>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button variant="outline" className="rounded-full">
              Voir toute l'équipe
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section ref={timelineRef} className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={timelineInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4">
              Notre Histoire
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Le parcours qui nous a menés jusqu'ici</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Depuis notre création en 2015, nous avons connu une croissance remarquable et franchi des étapes
              importantes dans notre mission.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-border"></div>

            {/* Timeline items */}
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={timelineInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"} md:flex-row`}
                >
                  <div className="flex-1 md:pr-12 md:text-right">
                    {index % 2 === 0 ? (
                      <>
                        <div className="bg-card p-6 rounded-xl shadow-sm border border-border inline-block">
                          <Badge variant="secondary" className="mb-2">
                            {item.year}
                          </Badge>
                          <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                          <p className="text-muted-foreground">{item.description}</p>
                        </div>
                      </>
                    ) : (
                      <div className="md:hidden bg-card p-6 rounded-xl shadow-sm border border-border">
                        <Badge variant="secondary" className="mb-2">
                          {item.year}
                        </Badge>
                        <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    )}
                  </div>

                  <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm z-10">
                      {item.year.slice(-2)}
                    </div>
                  </div>

                  <div className="flex-1 md:pl-12">
                    {index % 2 === 1 ? (
                      <div className="hidden md:block bg-card p-6 rounded-xl shadow-sm border border-border">
                        <Badge variant="secondary" className="mb-2">
                          {item.year}
                        </Badge>
                        <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    ) : (
                      <div className="md:hidden bg-card p-6 rounded-xl shadow-sm border border-border">
                        <Badge variant="secondary" className="mb-2">
                          {item.year}
                        </Badge>
                        <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">Nos Valeurs</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Les principes qui guident nos actions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nos valeurs fondamentales définissent notre culture et orientent chacune de nos décisions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-t-4 border-t-primary">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                    {value.icon}
                  </div>
                  <CardTitle>{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialsRef} className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4">
              Témoignages
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ce que disent nos apprenants</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Découvrez comment notre plateforme a transformé la vie et la carrière de nos étudiants.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden">
                        <img
                          src={testimonial.image || "/placeholder.svg"}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <CardTitle className="text-base">{testimonial.name}</CardTitle>
                        <CardDescription>{testimonial.role}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="italic text-muted-foreground">"{testimonial.quote}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button className="rounded-full">
              Voir plus de témoignages
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4">Nos Partenaires</Badge>
            <h2 className="text-3xl font-bold mb-4">Ils nous font confiance</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nous collaborons avec des entreprises et institutions de premier plan pour offrir des formations
              pertinentes et reconnues.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {partners.map((partner, index) => (
              <div key={index} className="flex justify-center">
                <img
                  src={partner || "/placeholder.svg"}
                  alt={`Partenaire ${index + 1}`}
                  width={120}
                  height={60}
                  className="opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              FAQ
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Questions fréquentes</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Trouvez des réponses aux questions les plus courantes sur notre plateforme et notre approche pédagogique.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">Vous ne trouvez pas la réponse à votre question ?</p>
            <Button variant="outline" className="rounded-full">
              Contactez-nous
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à transformer votre apprentissage ?</h2>
            <p className="text-white/80 text-lg mb-8">
              Rejoignez plus de 500 000 apprenants qui ont déjà fait confiance à notre plateforme pour développer leurs
              compétences et accélérer leur carrière.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="rounded-full">
                Explorer les cours
              </Button>
              <Button size="lg" variant="outline" className="rounded-full text-white border-white hover:bg-white/10">
                Essai gratuit de 7 jours
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4">Contact</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Parlons de vos besoins en formation</h2>
              <p className="text-muted-foreground mb-8">
                Que vous soyez un étudiant, une entreprise ou un instructeur potentiel, notre équipe est là pour
                répondre à toutes vos questions.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Email</h3>
                    <p className="text-muted-foreground">contact@elearningplatform.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Téléphone</h3>
                    <p className="text-muted-foreground">+33 1 23 45 67 89</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Adresse</h3>
                    <p className="text-muted-foreground">
                      123 Avenue de l'Innovation
                      <br />
                      75008 Paris, France
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Suivez-nous</h3>
                <div className="flex gap-4">
                  <Link
                    to="#"
                    className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    <Facebook className="h-5 w-5" />
                  </Link>
                  <Link
                    to="#"
                    className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    <Twitter className="h-5 w-5" />
                  </Link>
                  <Link
                    to="#"
                    className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    <Linkedin className="h-5 w-5" />
                  </Link>
                  <Link
                    to="#"
                    className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    <Instagram className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Envoyez-nous un message</CardTitle>
                <CardDescription>
                  Remplissez le formulaire ci-dessous et nous vous répondrons dans les 24 heures.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-sm font-medium">
                        Prénom
                      </label>
                      <input
                        id="firstName"
                        className="w-full p-2 rounded-md border border-input bg-background"
                        placeholder="Votre prénom"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-sm font-medium">
                        Nom
                      </label>
                      <input
                        id="lastName"
                        className="w-full p-2 rounded-md border border-input bg-background"
                        placeholder="Votre nom"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="w-full p-2 rounded-md border border-input bg-background"
                      placeholder="votre@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Sujet
                    </label>
                    <input
                      id="subject"
                      className="w-full p-2 rounded-md border border-input bg-background"
                      placeholder="Sujet de votre message"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full p-2 rounded-md border border-input bg-background resize-none"
                      placeholder="Votre message..."
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Envoyer le message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-muted/30 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">À propos</h3>
              <p className="text-muted-foreground mb-4">
                Plateforme d'apprentissage en ligne dédiée à rendre l'éducation accessible à tous, partout dans le
                monde.
              </p>
              <div className="flex gap-4">
                <Link
                  to="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link
                  to="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link
                  to="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  <Linkedin className="h-5 w-5" />
                </Link>
                <Link
                  to="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  <Instagram className="h-5 w-5" />
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Liens rapides</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Accueil
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Cours
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    À propos
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Devenir instructeur
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Catégories</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Développement Web
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Business
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Marketing Digital
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Design
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Data Science
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Langues
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Centre d'aide
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Politique de confidentialité
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Conditions d'utilisation
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Politique de remboursement
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} E-Learning Platform. Tous droits réservés.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link
                to="#"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Confidentialité
              </Link>
              <Link
                to="#"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Conditions
              </Link>
              <Link
                to="#"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default AboutUs;
