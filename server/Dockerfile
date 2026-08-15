# =========================
# Stage 1: Build
# =========================
FROM golang:1.26-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build Go application
RUN go build -o server .


# =========================
# Stage 2: Production
# =========================
FROM alpine:latest

WORKDIR /app

# Install CA certificates
RUN apk --no-cache add ca-certificates

# Copy binary dari builder
COPY --from=builder /app/server .

# Buat folder upload
RUN mkdir -p /app/uploads/blogs

# Port Fiber
EXPOSE 8081

# Jalankan aplikasi
CMD ["./server"]