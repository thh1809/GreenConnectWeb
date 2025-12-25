# ---------------------------------------------------
# 1. Giai đoạn Base: Cài môi trường Node
# ---------------------------------------------------
FROM node:18-alpine AS base

# ---------------------------------------------------
# 2. Giai đoạn Deps: Cài đặt thư viện (Dependencies)
# ---------------------------------------------------
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy các file quản lý gói tin
COPY package.json package-lock.json* pnpm-lock.yaml* ./

# Cài đặt thư viện (Tự động nhận diện npm, pnpm...)
RUN \
  if [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else npm ci; \
  fi

# ---------------------------------------------------
# 3. Giai đoạn Builder: Build code ra bản chạy thật
# ---------------------------------------------------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Tắt gửi dữ liệu ẩn danh cho Next.js (cho nhẹ)
ENV NEXT_TELEMETRY_DISABLED 1

# Lệnh build (Tạo ra thư mục .next/standalone)
RUN npm run build

# ---------------------------------------------------
# 4. Giai đoạn Runner: Chạy web (Chỉ lấy những gì cần thiết)
# ---------------------------------------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000

# Tạo user riêng tên là 'nextjs' để không chạy bằng Root (Bảo mật)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy file public (ảnh, icon...)
COPY --from=builder /app/public ./public

# Copy kết quả build nhỏ gọn (Standalone) sang đây
# Giúp giảm dung lượng cực lớn
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]