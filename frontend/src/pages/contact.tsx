import { useState } from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  CheckCircle2,
  HelpCircle,
  Users,
  BookOpen,
  CreditCard,
  Headphones,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Form schema validation
const formSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Veuillez entrer une adresse email valide" }),
  phone: z.string().optional(),
  subject: z.string().min(5, { message: "Le sujet doit contenir au moins 5 caractères" }),
  department: z.string({ required_error: "Veuillez sélectionner un département" }),
  message: z.string().min(10, { message: "Le message doit contenir au moins 10 caractères" }),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter les conditions d'utilisation",
  }),
})

type FormValues = z.infer<typeof formSchema>

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [activeTab, setActiveTab] = useState("form")

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      department: "",
      message: "",
      acceptTerms: false,
    },
  })

  // Form submission handler
  const onSubmit = async (data: FormValues) => {
    console.log("Form data:", data)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Show success message
    setIsSubmitted(true)
    form.reset()
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-background py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge variant="outline" className="mb-4 px-3 py-1 text-sm">
              Nous sommes à votre écoute
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Contactez-nous</h1>
            <p className="text-muted-foreground text-lg mb-8">
              Notre équipe est disponible pour répondre à toutes vos questions et vous aider dans votre parcours
              d'apprentissage.
            </p>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-1 space-y-6"
            >
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageSquare className="mr-2 h-5 w-5 text-primary" />
                      Nos coordonnées
                    </CardTitle>
                    <CardDescription>Plusieurs façons de nous contacter</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Email</p>
                        <a
                          href="mailto:contact@elearning.com"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          contact@elearning.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Phone className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Téléphone</p>
                        <a
                          href="tel:+33123456789"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          +33 1 23 45 67 89
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Adresse</p>
                        <address className="text-sm text-muted-foreground not-italic">
                          123 Avenue de l'Innovation
                          <br />
                          75008 Paris, France
                        </address>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Clock className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Horaires d'ouverture</p>
                        <p className="text-sm text-muted-foreground">
                          Lundi - Vendredi: 9h00 - 18h00
                          <br />
                          Samedi: 10h00 - 15h00
                          <br />
                          Dimanche: Fermé
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="mr-2 h-5 w-5 text-primary" />
                      Départements
                    </CardTitle>
                    <CardDescription>Contactez le service approprié</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start">
                      <BookOpen className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Support pédagogique</p>
                        <a
                          href="mailto:pedagogie@elearning.com"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          pedagogie@elearning.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <CreditCard className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Facturation</p>
                        <a
                          href="mailto:facturation@elearning.com"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          facturation@elearning.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Headphones className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Support technique</p>
                        <a
                          href="mailto:support@elearning.com"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          support@elearning.com
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <HelpCircle className="mr-2 h-5 w-5 text-primary" />
                      FAQ
                    </CardTitle>
                    <CardDescription>Questions fréquemment posées</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger>Comment puis-je m'inscrire à un cours ?</AccordionTrigger>
                        <AccordionContent>
                          Pour vous inscrire à un cours, naviguez vers la page du cours souhaité, cliquez sur
                          "S'inscrire" et suivez les instructions pour finaliser votre inscription.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger>Comment obtenir un certificat ?</AccordionTrigger>
                        <AccordionContent>
                          Les certificats sont délivrés automatiquement une fois que vous avez terminé tous les modules
                          du cours et réussi l'évaluation finale avec un score minimum de 70%.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3">
                        <AccordionTrigger>Puis-je demander un remboursement ?</AccordionTrigger>
                        <AccordionContent>
                          Oui, nous offrons une garantie de remboursement de 30 jours si vous n'êtes pas satisfait du
                          cours. Contactez notre service client pour plus d'informations.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle>Suivez-nous</CardTitle>
                    <CardDescription>Restez connecté sur nos réseaux sociaux</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-4">
                      <a href="#" className="p-2 rounded-full bg-background hover:bg-muted transition-colors">
                        <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                        <span className="sr-only">Facebook</span>
                      </a>
                      <a href="#" className="p-2 rounded-full bg-background hover:bg-muted transition-colors">
                        <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                        <span className="sr-only">Twitter</span>
                      </a>
                      <a href="#" className="p-2 rounded-full bg-background hover:bg-muted transition-colors">
                        <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                        <span className="sr-only">Instagram</span>
                      </a>
                      <a href="#" className="p-2 rounded-full bg-background hover:bg-muted transition-colors">
                        <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                        <span className="sr-only">LinkedIn</span>
                      </a>
                      <a href="#" className="p-2 rounded-full bg-background hover:bg-muted transition-colors">
                        <Youtube className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                        <span className="sr-only">YouTube</span>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Contact Form and Map */}
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="form">Formulaire de contact</TabsTrigger>
                  <TabsTrigger value="map">Carte & Directions</TabsTrigger>
                </TabsList>

                <TabsContent value="form" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Envoyez-nous un message</CardTitle>
                      <CardDescription>
                        Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isSubmitted ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-center py-8"
                        >
                          <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-primary/10">
                            <CheckCircle2 className="h-8 w-8 text-primary" />
                          </div>
                          <h3 className="text-2xl font-bold mb-2">Message envoyé !</h3>
                          <p className="text-muted-foreground mb-6">
                            Merci de nous avoir contacté. Notre équipe vous répondra dans les plus brefs délais.
                          </p>
                          <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                            Envoyer un autre message
                          </Button>
                        </motion.div>
                      ) : (
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Nom complet</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Jean Dupont" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                      <Input type="email" placeholder="jean.dupont@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Téléphone (optionnel)</FormLabel>
                                    <FormControl>
                                      <Input placeholder="+33 6 12 34 56 78" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="department"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Département</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Sélectionnez un département" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="support">Support technique</SelectItem>
                                        <SelectItem value="sales">Ventes</SelectItem>
                                        <SelectItem value="billing">Facturation</SelectItem>
                                        <SelectItem value="courses">Contenu des cours</SelectItem>
                                        <SelectItem value="partnership">Partenariats</SelectItem>
                                        <SelectItem value="other">Autre</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={form.control}
                              name="subject"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Sujet</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Objet de votre message" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="message"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Message</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Détaillez votre demande ici..."
                                      className="min-h-[120px]"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="acceptTerms"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                  <FormControl>
                                    <input
                                      type="checkbox"
                                      className="h-4 w-4 mt-1 text-primary border-gray-300 focus:ring-primary"
                                      checked={field.value}
                                      onChange={field.onChange}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>
                                      J'accepte que mes données soient traitées conformément à la politique de
                                      confidentialité
                                    </FormLabel>
                                    <FormMessage />
                                  </div>
                                </FormItem>
                              )}
                            />

                            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                              {form.formState.isSubmitting ? (
                                <>
                                  <span className="animate-spin mr-2">⏳</span>
                                  Envoi en cours...
                                </>
                              ) : (
                                <>
                                  <Send className="mr-2 h-4 w-4" />
                                  Envoyer le message
                                </>
                              )}
                            </Button>
                          </form>
                        </Form>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="map" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notre localisation</CardTitle>
                      <CardDescription>Venez nous rendre visite dans nos locaux</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      {/* Map iframe - Replace with your actual location */}
                      <div className="w-full h-[400px] bg-muted relative overflow-hidden">
                        <iframe
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.142047342144!2d2.3002659156744847!3d48.87456857928884!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66fc4f8f3049b%3A0xcbb47407434935db!2sArc%20de%20Triomphe!5e0!3m2!1sfr!2sfr!4v1650000000000!5m2!1sfr!2sfr"
                          width="100%"
                          height="400"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          title="Notre localisation"
                          className="w-full h-full"
                        ></iframe>
                      </div>

                      <div className="p-6">
                        <h3 className="text-lg font-semibold mb-2">Comment nous trouver</h3>
                        <p className="text-muted-foreground mb-4">
                          Nos bureaux sont situés au cœur de Paris, facilement accessibles en transports en commun.
                        </p>

                        <div className="space-y-3">
                          <div className="flex items-start">
                            <Badge variant="outline" className="mr-2 px-2 py-1">
                              Métro
                            </Badge>
                            <p className="text-sm">Lignes 1, 2, 6 - Station Charles de Gaulle Étoile</p>
                          </div>
                          <div className="flex items-start">
                            <Badge variant="outline" className="mr-2 px-2 py-1">
                              RER
                            </Badge>
                            <p className="text-sm">Ligne A - Station Charles de Gaulle Étoile</p>
                          </div>
                          <div className="flex items-start">
                            <Badge variant="outline" className="mr-2 px-2 py-1">
                              Bus
                            </Badge>
                            <p className="text-sm">Lignes 22, 30, 31, 52, 73, 92 - Arrêt Charles de Gaulle Étoile</p>
                          </div>
                          <div className="flex items-start">
                            <Badge variant="outline" className="mr-2 px-2 py-1">
                              Parking
                            </Badge>
                            <p className="text-sm">Parking public Étoile-Foch à 200m</p>
                          </div>
                        </div>

                        <Separator className="my-6" />

                        <div className="flex justify-between items-center">
                          <Button
                            variant="outline"
                            onClick={() => window.open("https://goo.gl/maps/your-location-link", "_blank")}
                          >
                            <MapPin className="mr-2 h-4 w-4" />
                            Itinéraire
                          </Button>

                          <Button variant="ghost" onClick={() => window.print()}>
                            Imprimer les directions
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Besoin d'une réponse rapide ?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Notre équipe de support est disponible par chat en direct pendant nos heures d'ouverture pour répondre à vos
            questions urgentes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gap-2">
              <MessageSquare className="h-5 w-5" />
              Démarrer un chat
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              <Phone className="h-5 w-5" />
              Nous appeler
            </Button>
          </div>
        </div>
      </section>

      {/* Alert for response time */}
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertTitle className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Délai de réponse
          </AlertTitle>
          <AlertDescription>
            Nous nous efforçons de répondre à toutes les demandes dans un délai de 24 heures ouvrées. Pendant les
            périodes de forte affluence, ce délai peut être légèrement plus long.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
