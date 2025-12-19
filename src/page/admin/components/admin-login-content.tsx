// 'use client';

// import { AnimatePresence, motion } from 'framer-motion';
// import { ArrowRight, Leaf, Loader2, Lock, Mail } from 'lucide-react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { FormEvent, useEffect, useState } from 'react';

// import { Button } from '@/components/ui/button';
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
// } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { adminLogin } from '@/lib/api/auth';
// import { cn } from '@/lib/utils';
// import Logo from '@public/Eco-Tech-logo-web-no-background.ico';

// // --- Animation Variants ---
// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.1,
//       delayChildren: 0.2,
//     },
//   },
// };

// const itemVariants = {
//   hidden: { y: 20, opacity: 0 },
//   visible: {
//     y: 0,
//     opacity: 1,
//     transition: {
//       duration: 0.5,
//     },
//   },
// };

// export function AdminLoginContent() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const redirectPath = searchParams.get('redirect') || '/admin/dashboard';

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);

//   const [mounted, setMounted] = useState(false);
//   useEffect(() => setMounted(true), []);

//   const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     setIsSubmitting(true);
//     setErrorMessage(null);

//     try {
//       const result = await adminLogin({ email, password });

//       if (typeof window !== 'undefined') {
//         sessionStorage.setItem('authToken', result.accessToken);
//         localStorage.removeItem('authToken');
//       }

//       const maxAge = 60 * 60 * 4;
//       document.cookie = `authToken=${result.accessToken}; path=/; max-age=${maxAge}; SameSite=Lax`;

//       router.push(redirectPath);
//     } catch (error) {
//       setErrorMessage(
//         error instanceof Error ? error.message : 'Đăng nhập thất bại.'
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     // Sử dụng bg-background từ theme (màu xám rất nhạt: 0 0% 96%)
//     <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-b from-gradient-primary-from to-gradient-secondary-to font-roboto selection:bg-primary/20 selection:text-primary-foreground">
//       {/* ===========================
//           🎨 BACKGROUND ELEMENTS
//       =========================== */}

//       {/* 1. Grid Pattern - Tech feel (Màu border nhẹ) */}
//       <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.4)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.4)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

//       {/* 2. Gradient Orbs - Sử dụng màu Primary (Xanh) và Secondary (Vàng chanh) từ Theme */}
//       <motion.div
//         animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
//         transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
//         className="absolute -left-[10%] -top-[10%] h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px]"
//       />
//       <motion.div
//         animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] }}
//         transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
//         className="absolute -bottom-[10%] -right-[10%] h-[500px] w-[500px] rounded-full bg-white/60 blur-[100px]"
//       />

//       {/* 3. Floating Leaves - Hiệu ứng lá rơi với màu Primary */}
//       {mounted && (
//         <div className="pointer-events-none absolute inset-0 overflow-hidden">
//           {[15, 12, 18, 20, 14].map((duration, i) => (
//             <motion.div
//               key={i}
//               initial={{ y: -100, opacity: 0, rotate: 0 }}
//               animate={{
//                 y: '110vh',
//                 opacity: [0, 1, 0],
//                 rotate: 360,
//                 transition: {
//                   duration: duration,
//                   repeat: Infinity,
//                   ease: 'linear',
//                   delay: 0,
//                 },
//               }}
//               className="absolute"
//               style={{ left: `${10 + i * 20}%` }}
//             >
//               {/* Lá cây sử dụng text-primary */}
//               <Leaf
//                 className={cn(
//                   'text-primary/50',
//                   i % 2 === 0 ? 'h-6 w-6' : 'h-10 w-10'
//                 )}
//               />
//             </motion.div>
//           ))}
//         </div>
//       )}

//       {/* ===========================
//           🔐 LOGIN CARD
//       =========================== */}
//       <motion.div
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//         className="relative z-10 w-full px-4"
//       >
//         {/* Card sử dụng bg-card (màu trắng) nhưng giảm opacity để tạo hiệu ứng kính */}
//         <Card className="mx-auto w-full max-w-[420px] overflow-hidden border-border/60 bg-card/80 shadow-2xl backdrop-blur-xl dark:bg-card/40 dark:shadow-primary/5">
//           {/* Decorative Top Border Gradient dùng biến theme */}
//           <div className="absolute top-0 left-0 right-0 h-1.5 bg-[image:var(--gradient-primary)]" />

//           <CardHeader className="space-y-4 pt-10 pb-6 text-center">
//             <motion.div
//               variants={itemVariants}
//               // Box logo sử dụng gradient nhẹ từ muted đến card
//               className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-card to-muted shadow-md ring-1 ring-border"
//             >
//               <Image
//                 src={Logo}
//                 alt="GreenConnect Logo"
//                 className="h-9 w-9 object-contain"
//               />
//             </motion.div>

//             <motion.div variants={itemVariants}>
//               <h1 className="text-2xl font-bold tracking-tight text-foreground">
//                 GreenConnect Admin
//               </h1>
//               <p className="mt-2 text-sm text-muted-foreground">
//                 Hệ thống quản lý sinh thái bền vững
//               </p>
//             </motion.div>
//           </CardHeader>

//           <CardContent>
//             <form onSubmit={onSubmit} className="space-y-5">
//               {/* Email Input */}
//               <motion.div variants={itemVariants} className="space-y-2">
//                 <Label
//                   htmlFor="email"
//                   className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80"
//                 >
//                   Email Tổ chức
//                 </Label>
//                 <div className="relative group">
//                   <Input
//                     id="email"
//                     type="email"
//                     placeholder="admin@greenconnect.vn"
//                     // Input style: border nhẹ, focus sẽ sáng màu Primary
//                     className="pl-10 h-11 border-input bg-background/50 text-sm transition-all focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10 group-hover:border-primary/50"
//                     value={email}
//                     onChange={e => setEmail(e.target.value)}
//                     required
//                     disabled={isSubmitting}
//                   />
//                   <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary/70 group-focus-within:text-primary" />
//                 </div>
//               </motion.div>

//               {/* Password Input */}
//               <motion.div variants={itemVariants} className="space-y-2">
//                 <div className="flex justify-between items-center">
//                   <Label
//                     htmlFor="password"
//                     className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80"
//                   >
//                     Mật khẩu
//                   </Label>
//                 </div>
//                 <div className="relative group">
//                   <Input
//                     id="password"
//                     type="password"
//                     placeholder="••••••••"
//                     className="pl-10 h-11 border-input bg-background/50 text-sm transition-all focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10 group-hover:border-primary/50"
//                     value={password}
//                     onChange={e => setPassword(e.target.value)}
//                     required
//                     disabled={isSubmitting}
//                   />
//                   <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary/70 group-focus-within:text-primary" />
//                 </div>
//               </motion.div>

//               {/* Error Message */}
//               <AnimatePresence>
//                 {errorMessage && (
//                   <motion.div
//                     initial={{ opacity: 0, height: 0 }}
//                     animate={{ opacity: 1, height: 'auto' }}
//                     exit={{ opacity: 0, height: 0 }}
//                     className="overflow-hidden"
//                   >
//                     <div className="flex items-center gap-2 rounded-md bg-danger/10 p-3 text-sm text-danger border border-danger/20">
//                       <div className="h-1.5 w-1.5 rounded-full bg-danger shrink-0 animate-pulse" />
//                       {errorMessage}
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>

//               {/* Submit Button */}
//               <motion.div variants={itemVariants} className="pt-2">
//                 <Button
//                   type="submit"
//                   // Nút bấm sử dụng gradient-primary từ theme variables
//                   className="w-full h-11 text-base font-medium shadow-lg shadow-primary/25 bg-[image:var(--gradient-primary)] hover:opacity-90 active:scale-[0.98] transition-all duration-200 text-primary-foreground border-0"
//                   disabled={isSubmitting}
//                 >
//                   {isSubmitting ? (
//                     <motion.div
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       className="flex items-center gap-2"
//                     >
//                       <Loader2 className="h-5 w-5 animate-spin" />
//                       <span>Đang xác thực...</span>
//                     </motion.div>
//                   ) : (
//                     <span className="flex items-center gap-2">
//                       Truy cập Dashboard <ArrowRight className="h-4 w-4" />
//                     </span>
//                   )}
//                 </Button>
//               </motion.div>
//             </form>
//           </CardContent>

//           <CardFooter className="flex flex-col gap-4 pb-8 pt-2">
//             <motion.div variants={itemVariants} className="w-full">
//               <div className="relative flex items-center py-2">
//                 <div className="flex-grow border-t border-muted"></div>
//                 <span className="flex-shrink-0 mx-4 text-xs text-muted-foreground/60">
//                   Hỗ trợ
//                 </span>
//                 <div className="flex-grow border-t border-muted"></div>
//               </div>
//             </motion.div>

//             <motion.p
//               variants={itemVariants}
//               className="text-xs text-muted-foreground text-center"
//             >
//               Gặp sự cố?{' '}
//               <Link
//                 href="/lien-he"
//                 className="font-medium text-primary hover:text-primary/80 hover:underline underline-offset-4 transition-colors"
//               >
//                 Liên hệ kỹ thuật viên
//               </Link>
//             </motion.p>
//           </CardFooter>
//         </Card>

//         {/* Footer Text outside card */}
//         <motion.div variants={itemVariants} className="mt-8 text-center">
//           <p className="text-xs text-muted-foreground/60">
//             &copy; {new Date().getFullYear()} Hệ thống xanh GreenConnect. Mọi
//             quyền được bảo lưu dành riêng.
//           </p>
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// }
'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Loader2, Lock, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner'; // Import Sonner

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { adminLogin } from '@/lib/api/auth';
import { cn } from '@/lib/utils';
import Logo from '@public/Eco-Tech-logo-web-no-background.ico';

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/admin/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Đã xóa errorMessage state vì dùng Sonner

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await adminLogin({ email, password });

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('authToken', result.accessToken);
        localStorage.removeItem('authToken');
      }

      const maxAge = 60 * 60 * 4;
      document.cookie = `authToken=${result.accessToken}; path=/; max-age=${maxAge}; SameSite=Lax`;

      // Hiển thị thông báo thành công
      toast.success('Đăng nhập thành công', {
        description: 'Đang chuyển hướng vào hệ thống quản trị...',
      });

      // Chuyển hướng
      router.push(redirectPath);
    } catch (error: any) {
      let msg = 'Đăng nhập thất bại.';
      if (error instanceof Error) {
        // Tìm phần Details: {...} trong error.message
        const match = error.message.match(/Details: (\{.*\})/);
        if (match) {
          try {
            const details = JSON.parse(match[1]);
            if (details.message) msg = details.message;
          } catch {}
        } else {
          msg = error.message;
        }
      }
      toast.error('Đăng nhập thất bại', {
        description: msg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // Sử dụng bg-background từ theme (màu xám rất nhạt: 0 0% 96%)
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-b from-gradient-primary-from to-gradient-secondary-to font-roboto selection:bg-primary/20 selection:text-primary-foreground">
      {/* ===========================
          🎨 BACKGROUND ELEMENTS
      =========================== */}

      {/* 1. Grid Pattern - Tech feel (Màu border nhẹ) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.4)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.4)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* 2. Gradient Orbs - Sử dụng màu Primary (Xanh) và Secondary (Vàng chanh) từ Theme */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-[10%] -top-[10%] h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px]"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-[10%] -right-[10%] h-[500px] w-[500px] rounded-full bg-white/60 blur-[100px]"
      />

      {/* 3. Floating Leaves - Hiệu ứng lá rơi với màu Primary */}
      {mounted && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {[15, 12, 18, 20, 14].map((duration, i) => (
            <motion.div
              key={i}
              initial={{ y: -100, opacity: 0, rotate: 0 }}
              animate={{
                y: '110vh',
                opacity: [0, 1, 0],
                rotate: 360,
                transition: {
                  duration: duration,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: 0,
                },
              }}
              className="absolute"
              style={{ left: `${10 + i * 20}%` }}
            >
              {/* Lá cây sử dụng text-primary */}
              <Leaf
                className={cn(
                  'text-primary/50',
                  i % 2 === 0 ? 'h-6 w-6' : 'h-10 w-10'
                )}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* ===========================
          🔐 LOGIN CARD
      =========================== */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full px-4"
      >
        {/* Card sử dụng bg-card (màu trắng) nhưng giảm opacity để tạo hiệu ứng kính */}
        <Card className="mx-auto w-full max-w-[420px] overflow-hidden border-border/60 bg-card/80 shadow-2xl backdrop-blur-xl dark:bg-card/40 dark:shadow-primary/5">
          {/* Decorative Top Border Gradient dùng biến theme */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[image:var(--gradient-primary)]" />

          <CardHeader className="space-y-4 pt-10 pb-6 text-center">
            <motion.div
              variants={itemVariants}
              // Box logo sử dụng gradient nhẹ từ muted đến card
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-card to-muted shadow-md ring-1 ring-border"
            >
              <Image
                src={Logo}
                alt="GreenConnect Logo"
                className="h-9 w-9 object-contain"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                GreenConnect Admin
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Hệ thống quản lý sinh thái bền vững
              </p>
            </motion.div>
          </CardHeader>

          <CardContent>
            <form onSubmit={onSubmit} className="space-y-5">
              {/* Email Input */}
              <motion.div variants={itemVariants} className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80"
                >
                  Email Tổ chức
                </Label>
                <div className="relative group">
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@greenconnect.vn"
                    // Input style: border nhẹ, focus sẽ sáng màu Primary
                    className="pl-10 h-11 border-input bg-background/50 text-sm transition-all focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10 group-hover:border-primary/50"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary/70 group-focus-within:text-primary" />
                </div>
              </motion.div>

              {/* Password Input */}
              <motion.div variants={itemVariants} className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label
                    htmlFor="password"
                    className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80"
                  >
                    Mật khẩu
                  </Label>
                </div>
                <div className="relative group">
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 h-11 border-input bg-background/50 text-sm transition-all focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10 group-hover:border-primary/50"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary/70 group-focus-within:text-primary" />
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants} className="pt-2">
                <Button
                  type="submit"
                  // Nút bấm sử dụng gradient-primary từ theme variables
                  className="w-full h-11 text-base font-medium shadow-lg shadow-primary/25 bg-[image:var(--gradient-primary)] hover:opacity-90 active:scale-[0.98] transition-all duration-200 text-primary-foreground border-0"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2"
                    >
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Đang xác thực...</span>
                    </motion.div>
                  ) : (
                    <span className="flex items-center gap-2">
                      Truy cập Dashboard <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pb-8 pt-2">
            <motion.div variants={itemVariants} className="w-full">
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-muted"></div>
                <span className="flex-shrink-0 mx-4 text-xs text-muted-foreground/60">
                  Hỗ trợ
                </span>
                <div className="flex-grow border-t border-muted"></div>
              </div>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-xs text-muted-foreground text-center"
            >
              Gặp sự cố?{' '}
              <Link
                href="/lien-he"
                className="font-medium text-primary hover:text-primary/80 hover:underline underline-offset-4 transition-colors"
              >
                Liên hệ kỹ thuật viên
              </Link>
            </motion.p>
          </CardFooter>
        </Card>

        {/* Footer Text outside card */}
        <motion.div variants={itemVariants} className="mt-8 text-center">
          <p className="text-xs text-muted-foreground/60">
            &copy; {new Date().getFullYear()} Hệ thống xanh GreenConnect. Mọi
            quyền được bảo lưu dành riêng.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
