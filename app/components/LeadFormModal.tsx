"use client";
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { CheckCircle } from 'lucide-react';
import { leadsAPI } from '@/lib/api-client';

interface LeadFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName?: string;
}

type ApiErrorShape = {
  response?: {
    status?: number;
    data?: {
      error?: string;
    };
  };
};

const LeadFormModal = ({ open, onOpenChange, productName }: LeadFormModalProps) => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+998');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith('+998')) {
      val = '+998';
    }
    setPhone(val);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || phone === '+998') {
      setError(t('lead.phoneRequired'));
      return;
    }
    setLoading(true);
    try {
      await leadsAPI.create({
        name: name || "Noma'lum",
        phone,
        message: productName ? `Mahsulot: ${productName}` : "Umumiy so'rov",
        source: 'website',
      });
      setSubmitted(true);
      setName('');
      setPhone('+998');
      setError('');
    } catch (err: unknown) {
      const normalized = err as ApiErrorShape;
      const status = normalized.response?.status;
      const apiError = normalized.response?.data?.error;

      if (status === 409) {
        setError('Bu raqam bilan yaqinda so\'rov yuborilgan. Birozdan keyin urinib ko\'ring.');
      } else if (status === 429) {
        setError('Juda ko\'p urinish bo\'ldi. 1 daqiqadan keyin qayta urinib ko\'ring.');
      } else if (apiError) {
        setError(apiError);
      } else {
        setError('Xatolik yuz berdi. Qayta urinib ko\'ring.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (val: boolean) => {
    onOpenChange(val);
    if (!val) {
      setTimeout(() => {
        setSubmitted(false);
        setPhone('+998');
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {submitted ? (
          <div className="flex flex-col items-center py-8 gap-4 text-center">
            <CheckCircle className="w-16 h-16 text-gold" />
            <p className="text-lg font-medium">{t('lead.success')}</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">{t('lead.title')}</DialogTitle>
              <DialogDescription>{t('lead.subtitle')}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <Input
                placeholder={t('lead.name')}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <div>
                <Input
                  placeholder="+998 XX XXX XX XX"
                  value={phone}
                  onChange={handlePhoneChange}
                  type="tel"
                  required
                />
                {error && <p className="text-sm text-destructive mt-1">{error}</p>}
              </div>
              <Button type="submit" variant="gold" className="w-full text-base h-12" disabled={loading}>
                {loading ? 'Yuborilmoqda...' : t('lead.submit')}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LeadFormModal;