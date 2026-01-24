"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const contactFormSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  firstname: z.string().min(1, "Le prénom est requis"),
  email: z.string().email("Email invalide").min(1, "L'email est requis"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
  botcheck: z.boolean().optional(), // Antispam Web3Forms
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      firstname: "",
      email: "",
      phone: "" as string | undefined,
      subject: "" as string | undefined,
      message: "",
      botcheck: false,
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setError(null);

    const web3formsKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
    
    // Vérifier que la clé API est présente
    if (!web3formsKey) {
      setError('La clé API Web3Forms n\'est pas configurée. Veuillez contacter l\'administrateur.');
      setIsSubmitting(false);
      if (process.env.NODE_ENV === 'development') {
        console.error('[ContactForm] NEXT_PUBLIC_WEB3FORMS_KEY is not set');
      }
      return;
    }

    const payload = {
      access_key: web3formsKey,
      name: data.name,
      firstname: data.firstname,
      email: data.email,
      phone: data.phone || '',
      subject: data.subject || '',
      message: data.message,
      botcheck: data.botcheck || false,
      from_name: `${data.firstname} ${data.name}`,
    };

    // Debug en développement
    if (process.env.NODE_ENV === 'development') {
      console.log('[ContactForm] Submitting form with payload:', {
        ...payload,
        access_key: '***hidden***',
      });
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      // Debug en développement
      if (process.env.NODE_ENV === 'development') {
        console.log('[ContactForm] Web3Forms response:', result);
      }

      if (result.success) {
        form.reset();
        setIsSubmitted(true);
        // Réinitialiser le message de succès après 5 secondes
        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      } else {
        const errorMessage = result.message || 'Une erreur est survenue lors de l\'envoi du message.';
        setError(errorMessage);
        if (process.env.NODE_ENV === 'development') {
          console.error('[ContactForm] Web3Forms error:', result);
        }
      }
    } catch (err) {
      const errorMessage = 'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.';
      setError(errorMessage);
      if (process.env.NODE_ENV === 'development') {
        console.error('[ContactForm] Submit error:', err);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="p-8 rounded-lg border border-green-200 bg-green-50">
        <div className="flex items-center gap-3 mb-2">
          <svg
            className="w-6 h-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h3 className="text-lg font-semibold text-green-900">
            Message envoyé avec succès !
          </h3>
        </div>
        <p className="text-green-800">
          Merci pour votre message. Je vous répondrai dans les plus brefs délais.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Antispam Web3Forms - Champ caché */}
        <FormField
          control={form.control}
          name="botcheck"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <input
                  type="checkbox"
                  {...field}
                  checked={field.value ?? false}
                  value=""
                  className="hidden"
                  style={{ display: 'none' }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Ligne 1 : Nom & Prénom (côte à côte sur desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Nom <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Votre nom" 
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Prénom <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Votre prénom" 
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Ligne 2 : Email (pleine largeur) */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Email <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="votre@email.com" 
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Ligne 3 : Téléphone (pleine largeur, optionnel) */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Téléphone <span className="text-muted-foreground text-sm font-normal">(Optionnel)</span>
              </FormLabel>
              <FormControl>
                <Input 
                  type="tel" 
                  placeholder="+33 6 12 34 56 78" 
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Ligne 4 : Sujet (optionnel) */}
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Sujet <span className="text-muted-foreground text-sm font-normal">(Optionnel)</span>
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Sujet de votre message" 
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Message */}
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Message <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Décrivez votre projet ou votre question..."
                  className="min-h-[150px]"
                  rows={6}
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Message d'erreur */}
        {error && (
          <div className="p-4 rounded-lg border border-destructive/50 bg-destructive/10">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Bouton d'envoi */}
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Envoi...' : 'Envoyer'}
        </Button>
      </form>
    </Form>
  );
}
