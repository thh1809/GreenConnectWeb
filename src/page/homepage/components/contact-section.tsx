import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function ContactSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-gradient-primary-from to-gradient-primary-to text-foreground transition-colors duration-300">
      <div className="container max-w-3xl mx-auto pt-10">
        <Card className="p-8 bg-card text-card-foreground border border-border shadow-soft animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Liên hệ với chúng tôi</h2>
          <p className="text-lg text-muted-foreground mb-8 text-center">
            Nếu bạn có thắc mắc, góp ý hoặc cần hỗ trợ, hãy gửi thông tin cho chúng tôi qua form dưới đây hoặc liên hệ trực tiếp.
          </p>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input type="text" placeholder="Họ và tên" required />
              <Input type="email" placeholder="Email" required />
            </div>
            <Input type="text" placeholder="Số điện thoại" />
            <Textarea placeholder="Nội dung liên hệ..." rows={5} required />
            <Button type="submit" size="lg" className="w-full font-semibold text-lg">Gửi liên hệ</Button>
          </form>

          <div className="mt-10 grid gap-4 md:grid-cols-3 text-center">
            <div className="flex flex-col items-center gap-2">
              <Mail className="w-6 h-6 text-primary" />
              <span className="font-medium">contact@greenconnect.vn</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Phone className="w-6 h-6 text-primary" />
              <span className="font-medium">0123 456 789</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <MapPin className="w-6 h-6 text-primary" />
              <span className="font-medium">123 Đường Xanh, Quận 1, TP.HCM</span>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
