"use client";

import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Handshake, MessageSquareQuote, Trash2, ToggleLeft, ToggleRight, PlusCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
    createPartnerAction,
    deletePartnerAction,
    createTestimonialAction,
    deleteTestimonialAction,
    toggleFeatureAction
} from '@/app/admin/actions';

export default function SettingsTab({ initialPartners, initialTestimonials }: { initialPartners: any[], initialTestimonials: any[] }) {
  const [partners, setPartners] = useState(initialPartners);
  const [testimonials, setTestimonials] = useState(initialTestimonials);

  const [isPartnerModalOpen, setPartnerModalOpen] = useState(false);
  const [isTestimonialModalOpen, setTestimonialModalOpen] = useState(false);

  const handlePartnerSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;

    const promise = createPartnerAction(formData);

    toast.promise(promise, {
      loading: 'Adding partner...',
      success: (result) => {
        if(result.success) {
          const newPartner = { id: Math.random(), name };
          setPartners([newPartner, ...partners]);
          setPartnerModalOpen(false);
          return result.message;
        } else {
          throw new Error(result.message);
        }
      },
      error: (err) => `Error: ${err.message}`,
    });
  };

  const handleTestimonialSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const role = formData.get('role') as string;
    const quote = formData.get('quote') as string;

    const promise = createTestimonialAction(formData);

    toast.promise(promise, {
      loading: 'Adding testimonial...',
      success: (result) => {
        if(result.success) {
          const newTestimonial = { id: Math.random(), name, role, quote, is_featured: false };
          setTestimonials([newTestimonial, ...testimonials]);
          setTestimonialModalOpen(false);
          return result.message;
        } else {
          throw new Error(result.message);
        }
      },
      error: (err) => `Error: ${err.message}`,
    });
  };

  const onDeletePartner = async (id: string) => {
    if (!confirm("Are you sure you want to delete this partner?")) return;

    const originalPartners = partners;
    setPartners(partners.filter(p => p.id !== id));

    const result = await deletePartnerAction(id);
    if (!result.success) {
      toast.error(result.message);
      setPartners(originalPartners);
    } else {
      toast.success(result.message);
    }
  };

  const onDeleteTestimonial = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    const originalTestimonials = testimonials;
    setTestimonials(testimonials.filter(t => t.id !== id));

    const result = await deleteTestimonialAction(id);
    if (!result.success) {
      toast.error(result.message);
      setTestimonials(originalTestimonials);
    } else {
      toast.success(result.message);
    }
  };

  const onToggleFeature = async (id: string, currentStatus: boolean) => {
    setTestimonials(testimonials.map(t => t.id === id ? {...t, is_featured: !currentStatus} : t));
    const result = await toggleFeatureAction(id, !currentStatus);
    if (!result.success) {
        toast.error(result.message);
        setTestimonials(testimonials.map(t => t.id === id ? {...t, is_featured: currentStatus} : t));
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Partners Management */}
        <div className="bg-white p-6 rounded-xl border">
          <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2"><Handshake size={20} /> Manage Partners</h2>
              <button onClick={() => setPartnerModalOpen(true)} className="text-sm flex items-center gap-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700">
                  <PlusCircle size={16} /> Add Partner
              </button>
          </div>
          <ul className="space-y-2">
              {partners.map(partner => (
                  <li key={partner.id} className="flex items-center justify-between p-2 border rounded-lg">
                      <span className="font-medium">{partner.name}</span>
                      <button onClick={() => onDeletePartner(partner.id)} className="text-red-600 p-2 hover:bg-red-100 rounded-full"><Trash2 size={16}/></button>
                  </li>
              ))}
          </ul>
        </div>

        {/* Testimonials Management */}
        <div className="bg-white p-6 rounded-xl border">
          <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2"><MessageSquareQuote size={20} /> Manage Testimonials</h2>
              <button onClick={() => setTestimonialModalOpen(true)} className="text-sm flex items-center gap-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700">
                  <PlusCircle size={16} /> Add Testimonial
              </button>
          </div>
          <ul className="space-y-2">
              {testimonials.map(t => (
                  <li key={t.id} className="p-2 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">"{t.quote}"</p>
                          <p className="text-sm text-slate-500">- {t.name}, {t.role}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => onToggleFeature(t.id, t.is_featured)} title="Toggle Feature">
                              {t.is_featured ? <ToggleRight className="text-green-600" size={24} /> : <ToggleLeft className="text-slate-400" size={24} />}
                          </button>
                          <button onClick={() => onDeleteTestimonial(t.id)} className="text-red-600 p-2 hover:bg-red-100 rounded-full"><Trash2 size={16}/></button>
                        </div>
                      </div>
                  </li>
              ))}
          </ul>
        </div>
      </div>

      {/* Add Partner Modal */}
      <Transition appear show={isPartnerModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setPartnerModalOpen(false)}>
            <div className="fixed inset-0 bg-black/30" />
            <div className="fixed inset-0 overflow-y-auto"><div className="flex min-h-full items-center justify-center p-4 text-center">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl">
                    <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-gray-900">Add New Partner</Dialog.Title>
                    <form onSubmit={handlePartnerSubmit} className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Partner Name</label>
                        <input type="text" name="name" id="name" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                      </div>
                      <div>
                        <label htmlFor="logo_url" className="block text-sm font-medium text-gray-700">Logo URL (Optional)</label>
                        <input type="url" name="logo_url" id="logo_url" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                      </div>
                      <div className="mt-4 space-x-2"><button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg">Save Partner</button><button type="button" onClick={() => setPartnerModalOpen(false)} className="py-2 px-4 rounded-lg border">Cancel</button></div>
                    </form>
                </Dialog.Panel>
            </div></div>
        </Dialog>
      </Transition>

       {/* Add Testimonial Modal */}
       <Transition appear show={isTestimonialModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setTestimonialModalOpen(false)}>
            <div className="fixed inset-0 bg-black/30" />
            <div className="fixed inset-0 overflow-y-auto"><div className="flex min-h-full items-center justify-center p-4 text-center">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl">
                    <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-gray-900">Add New Testimonial</Dialog.Title>
                    <form onSubmit={handleTestimonialSubmit} className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="t-name" className="block text-sm font-medium text-gray-700">Person's Name</label>
                        <input type="text" name="name" id="t-name" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                      </div>
                       <div>
                        <label htmlFor="t-role" className="block text-sm font-medium text-gray-700">Role / Company</label>
                        <input type="text" name="role" id="t-role" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                      </div>
                      <div>
                        <label htmlFor="t-quote" className="block text-sm font-medium text-gray-700">Quote</label>
                        <textarea name="quote" id="t-quote" required rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                      </div>
                      <div className="mt-4 space-x-2"><button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg">Save Testimonial</button><button type="button" onClick={() => setTestimonialModalOpen(false)} className="py-2 px-4 rounded-lg border">Cancel</button></div>
                    </form>
                </Dialog.Panel>
            </div></div>
        </Dialog>
      </Transition>
    </>
  );
}