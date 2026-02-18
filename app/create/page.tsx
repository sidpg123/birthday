"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ImagePlus, Loader2, PartyPopper, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import { publishWish } from "@/lib/api/create";
import { getUploadUrl } from "@/lib/api/s3";

/* ─────────────────── Schema ─────────────────── */

const schema = z.object({
    senderName: z.string().min(1, "Your name is required"),
    recipientName: z.string().min(1, "Recipient name is required"),
    message: z
        .string()
        .min(10, "Message must be at least 10 characters")
        .max(500, "Message must be under 500 characters"),
    envelopImage: z
        .any()
        .refine((f) => f?.[0]?.type?.startsWith("image/"), {
            message: "Please upload a valid image file",
        }),
});

type FormValues = z.infer<typeof schema>;

interface MemoryState {
    file?: File;
    preview?: string;
    caption: string;
}

/* ─────────────────── Upload helper ─────────────────── */

// Replace the helper to call getUploadUrl directly, not via mutation
// async function presignAndUpload(key: string, file: File): Promise<string> {
//     const res = await getUploadUrl({ key });
//     const { uploadUrl } = res.data;

//     const put = await fetch(uploadUrl, {
//         method: "PUT",
//         headers: { "Content-Type": file.type },
//         body: file,
//     });
//     if (!put.ok) throw new Error(`S3 PUT failed for ${key}`);

//     return key; // ← just return the key, that's all you need
// }

/* ─────────────────── Component ─────────────────── */

export default function CreateWishPage() {
    const [wishId, setWishId] = useState<string | null>(null);
    const [envelopePreview, setEnvelopePreview] = useState<string | null>(null);
    const [published, setPublished] = useState(false);
    const [slug, setSlug] = useState<string | null>(null);
    const envelopeInputRef = useRef<HTMLInputElement | null>(null);

    const [memories, setMemories] = useState<MemoryState[]>(
        Array.from({ length: 4 }, () => ({ caption: "" }))
    );

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            senderName: "",
            recipientName: "",
            message: "",
            envelopImage: undefined,
        },
    });


    const message = form.watch("message") ?? "";

    /* ── Session mutation ── */
    const sessionMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch("/api/upload-session", { method: "POST" });
            if (!res.ok) throw new Error("Session creation failed");
            return res.json() as Promise<{ wishId: string }>;
        },
        onSuccess: (data) => {
            setWishId(data.wishId);
            sessionStorage.setItem("wishId", data.wishId);
        },
        onError: () => {
            toast.error("Failed to start session", {
                description: "Please refresh the page and try again.",
            });
        },
    });

    useEffect(() => {
        sessionMutation.mutate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ── Get upload URL mutation ── */
    const getUploadUrlMutation = useMutation({
        mutationFn: getUploadUrl,
    });

    /* ── Publish mutation ── */
    const publishMutation = useMutation({
        mutationFn: publishWish,
        onSuccess: () => {
            setPublished(true);
            toast.success("Wish published! 🎉", {
                description: "Your birthday wish is live and ready to share.",
            });
        },
        onError: () => {
            toast.error("Publishing failed", {
                description: "Something went wrong. Please try again.",
            });
        },
    });

    /* ── Submit with PARALLEL uploads via Promise.all ── */
    async function onSubmit(values: FormValues) {
        if (!wishId) return;

        const toastId = toast.loading("Uploading files in parallel…");

        try {
            const envelopeFile = values.envelopImage[0] as File;
            const envelopeExt = envelopeFile.name.split(".").pop();
            const envelopeKey = `wishes/${wishId}/envelope.${envelopeExt}`;

            // Prepare memory upload tasks (only slots with files)
            const memoryTasks = memories
                .map((mem, i) => ({ mem, i }))
                .filter(({ mem }) => !!mem.file)
                .map(({ mem, i }) => ({
                    mem,
                    i,
                    key: `wishes/${wishId}/${i}.${mem.file!.name.split(".").pop()}`
                }));

            console.log("Memory tasks with keys:", JSON.stringify(memoryTasks));

            // 2. Get ALL presigned URLs in parallel first
            const [envelopeUrlRes, ...uploadUrl] = await Promise.all([
                getUploadUrl({
                    key: `wishes/${wishId}/envelope.${envelopeFile.name.split(".").pop()}`,
                    // contentType: envelopeFile.type
                }),
                ...memoryTasks.map(({ mem, i, key }) =>
                    getUploadUrl({
                        // key: `wishes/${wishId}/${i}.${mem.file!.name.split(".").pop()}`,
                        key
                        // contentType: mem.file!.type
                    })
                ),
            ]);

            console.log("Received presigned URLs:", {
                envelopeUrl: envelopeUrlRes.data.uploadUrl,
                memoryUploadUrls: uploadUrl.map((res) => res.data.uploadUrl),
            });

            await Promise.all([
                fetch(envelopeUrlRes.data.uploadUrl, {
                    method: "PUT",
                    headers: { "Content-Type": envelopeFile.type },
                    body: envelopeFile,
                }),
                ...memoryTasks.map(({ mem }, idx) =>
                    fetch(uploadUrl[idx].data.uploadUrl, {
                        method: "PUT",
                        headers: { "Content-Type": mem.file!.type },
                        body: mem.file!,
                    })
                ),
            ]);

            const uploadedMemories = memoryTasks.map(({ mem, i, key }, idx) => ({
                imageUrl: key,
                caption: mem.caption,
                order: i,
            }));
            console.log("Prepared memory data for publish:", uploadedMemories);
            toast.loading("Publishing wish…", { id: toastId });

            const result = await publishMutation.mutateAsync({
                wishId,
                senderName: values.senderName,
                recipientName: values.recipientName,
                message: values.message,
                envelopeImageUrl: envelopeKey,
                memories: uploadedMemories,
            });
            setSlug(result.slug);
            console.log("Slug set is: ", slug)

            console.log(result);
            toast.dismiss(toastId);
        } catch (error) {
            console.log("error occured", error)
            toast.error("Upload failed", {
                id: toastId,
                description: "One or more files couldn't be uploaded. Please try again.",
            });
        }
    }

    /* ── Memory helpers ── */
    function setMemoryFile(index: number, file: File) {
        setMemories((prev) => {
            const copy = [...prev];
            if (copy[index].preview) URL.revokeObjectURL(copy[index].preview!);
            copy[index] = { ...copy[index], file, preview: URL.createObjectURL(file) };
            return copy;
        });
    }

    function setCaption(index: number, caption: string) {
        setMemories((prev) => {
            const copy = [...prev];
            copy[index] = { ...copy[index], caption };
            return copy;
        });
    }

    function removeMemory(index: number) {
        setMemories((prev) => {
            const copy = [...prev];
            if (copy[index].preview) URL.revokeObjectURL(copy[index].preview!);
            copy[index] = { caption: "" };
            return copy;
        });
    }

    const isLoading = form.formState.isSubmitting || publishMutation.isPending;
    const memoriesWithFiles = memories.filter((m) => m.file).length;

    /* ─────────── Success screen ─────────── */
    if (published) {
        return (
            <div className="min-h-screen bg-rose-50 flex items-center justify-center p-6">
                <Card className="max-w-sm w-full text-center shadow-2xl border-rose-100">
                    <CardContent className="pt-12 pb-10 px-10">
                        <div className="text-6xl mb-5 animate-bounce">🎉</div>
                        <h2 className="font-serif text-3xl font-bold text-rose-900 mb-2">
                            Wish Published!
                        </h2>
                        <p className="text-rose-400 text-sm">
                            Your birthday wish is live and ready to share.
                        </p>
                        <p>
                            You can access it at:
                            <a href={`${window.location.origin}/wish/${slug}`} className="text-rose-600 hover:underline">{window.location.origin}/wish/{slug}</a> <br />
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    /* ─────────── Page ─────────── */
    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50/60 to-pink-50">

            {/* ── Hero header ── */}


            {/* ── Form ── */}
            <div className="max-w-2xl mx-auto px-4 pt-10 pb-14 space-y-4">

                {sessionMutation.isError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
                        <X className="w-4 h-4 flex-shrink-0" />
                        Session failed. Please refresh the page.
                    </div>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        {/* ── 01 Names ── */}
                        <Card className="shadow-sm border-0 ring-1 ring-rose-100/80">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2.5 text-sm font-semibold text-rose-900">
                                    <Badge variant="outline" className="text-rose-500 border-rose-200 bg-rose-50/80 font-mono text-[10px] h-5 px-1.5">
                                        01
                                    </Badge>
                                    Who's this for?
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-0">
                                <FormField
                                    control={form.control}
                                    name="recipientName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                                Recipient's Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. Priya"
                                                    className="border-slate-200 focus-visible:ring-rose-400 focus-visible:border-rose-300 bg-white"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="senderName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                                Your Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. Arjun"
                                                    className="border-slate-200 focus-visible:ring-rose-400 focus-visible:border-rose-300 bg-white"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* ── 02 Message ── */}
                        <Card className="shadow-sm border-0 ring-1 ring-rose-100/80">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2.5 text-sm font-semibold text-rose-900">
                                    <Badge variant="outline" className="text-rose-500 border-rose-200 bg-rose-50/80 font-mono text-[10px] h-5 px-1.5">
                                        02
                                    </Badge>
                                    Write your message
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <FormField
                                    control={form.control}
                                    name="message"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                                Heartfelt Message
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Write something beautiful for them…"
                                                    className="min-h-[120px] resize-y border-slate-200 focus-visible:ring-rose-400 focus-visible:border-rose-300 bg-white"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <div className="flex justify-between items-center mt-1">
                                                <FormMessage className="text-xs" />
                                                <span
                                                    className={`ml-auto text-[11px] tabular-nums transition-colors ${message.length > 450
                                                        ? "text-orange-500 font-semibold"
                                                        : "text-slate-400"
                                                        }`}
                                                >
                                                    {message.length} / 500
                                                </span>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* ── 03 Envelope photo ── */}
                        <Card className="shadow-sm border-0 ring-1 ring-rose-100/80">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2.5 text-sm font-semibold text-rose-900">
                                    <Badge variant="outline" className="text-rose-500 border-rose-200 bg-rose-50/80 font-mono text-[10px] h-5 px-1.5">
                                        03
                                    </Badge>
                                    Envelope cover photo
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <p className="text-[11px] text-slate-400 mb-3">
                                    This photo appears on the front of the virtual envelope.
                                </p>
                                <FormField
                                    control={form.control}
                                    name="envelopImage"
                                    render={({ field: { onChange, value, ref, ...rest } }) => (
                                        <FormItem>
                                            <FormControl>
                                                <label
                                                    className={`group relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-all overflow-hidden
                            ${envelopePreview
                                                            ? "border-amber-300 bg-amber-50/30"
                                                            : "border-slate-200 bg-slate-50/80 hover:border-rose-300 hover:bg-rose-50/40"
                                                        }`}
                                                >
                                                    {envelopePreview ? (
                                                        <div className="relative w-full">
                                                            <img
                                                                src={envelopePreview}
                                                                alt="Envelope preview"
                                                                className="w-full max-h-60 object-cover"
                                                            />
                                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                                                <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-semibold bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm transition-all">
                                                                    Change photo
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center gap-2 py-10">
                                                            <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
                                                                <Upload className="w-5 h-5 text-rose-400" />
                                                            </div>
                                                            <div className="text-center">
                                                                <p className="text-sm font-medium text-slate-600">
                                                                    Click or drag to upload
                                                                </p>
                                                                <p className="text-xs text-slate-400 mt-0.5">
                                                                    PNG, JPG, WEBP · Max 10 MB
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="sr-only"
                                                        ref={(el) => {
                                                            envelopeInputRef.current = el;
                                                            ref(el);
                                                        }}
                                                        onChange={(e) => {
                                                            onChange(e.target.files);
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                if (envelopePreview) URL.revokeObjectURL(envelopePreview);
                                                                setEnvelopePreview(URL.createObjectURL(file));
                                                            }
                                                        }}
                                                        {...rest}
                                                    />
                                                </label>
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                            {envelopePreview && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-400 hover:text-red-600 hover:bg-red-50 mt-1 h-7 px-2 text-xs"
                                                    onClick={() => {
                                                        if (envelopePreview) URL.revokeObjectURL(envelopePreview);
                                                        setEnvelopePreview(null);
                                                        form.resetField("envelopImage");
                                                        if (envelopeInputRef.current) envelopeInputRef.current.value = "";
                                                    }}
                                                >
                                                    <X className="w-3 h-3 mr-1" />
                                                    Remove
                                                </Button>
                                            )}
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* ── 04 Memories ── */}
                        <Card className="shadow-sm border-0 ring-1 ring-rose-100/80">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2.5 text-sm font-semibold text-rose-900">
                                        <Badge variant="outline" className="text-rose-500 border-rose-200 bg-rose-50/80 font-mono text-[10px] h-5 px-1.5">
                                            04
                                        </Badge>
                                        Cherished memories
                                    </CardTitle>
                                    {memoriesWithFiles > 0 && (
                                        <Badge className="bg-rose-100 text-rose-600 hover:bg-rose-100 border-0 text-[10px] h-5">
                                            {memoriesWithFiles} / 4 added
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <p className="text-[11px] text-slate-400 mb-4">
                                    Upload up to 4 photos — they'll form a memory gallery inside the wish.
                                </p>
                                <div className="grid grid-cols-2 gap-3">
                                    {memories.map((mem, i) => (
                                        <div
                                            key={i}
                                            className={`group relative flex flex-col rounded-xl overflow-hidden border transition-all duration-200
                        ${mem.preview
                                                    ? "border-amber-200 ring-1 ring-amber-100 shadow-sm"
                                                    : "border-dashed border-slate-200 hover:border-rose-300 hover:bg-rose-50/30"
                                                }`}
                                        >
                                            {/* Photo */}
                                            <label className="block cursor-pointer">
                                                {mem.preview ? (
                                                    <div className="relative">
                                                        <img
                                                            src={mem.preview}
                                                            alt={`Memory ${i + 1}`}
                                                            className="w-full aspect-[4/3] object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                                                        />
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                            <ImagePlus className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center gap-2 aspect-[4/3] bg-slate-50 transition-colors group-hover:bg-rose-50/30">
                                                        <ImagePlus className="w-6 h-6 text-slate-300" />
                                                        <span className="text-[10px] font-medium text-slate-400">
                                                            Photo {i + 1}
                                                        </span>
                                                    </div>
                                                )}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="sr-only"
                                                    onChange={(e) => {
                                                        if (e.target.files?.[0]) setMemoryFile(i, e.target.files[0]);
                                                    }}
                                                />
                                            </label>

                                            {/* Remove btn */}
                                            {mem.preview && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeMemory(i)}
                                                    className="absolute top-1.5 right-1.5 z-10 w-6 h-6 rounded-full bg-black/55 hover:bg-red-500 text-white flex items-center justify-center transition-colors"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            )}

                                            <Separator className="bg-slate-100" />

                                            {/* Caption */}
                                            <input
                                                type="text"
                                                placeholder={mem.file ? "Add a caption…" : "Upload to add caption"}
                                                value={mem.caption}
                                                disabled={!mem.file}
                                                onChange={(e) => setCaption(i, e.target.value)}
                                                className="w-full px-2.5 py-2 text-[11px] text-slate-700 bg-white placeholder:text-slate-300 outline-none focus:bg-amber-50/60 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* ── Submit ── */}
                        <div className="pt-2 pb-6">
                            <Button
                                type="submit"
                                disabled={isLoading || !wishId || sessionMutation.isPending}
                                size="lg"
                                className="w-full h-12 text-[15px] font-semibold bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 shadow-lg shadow-rose-200 hover:shadow-xl hover:shadow-rose-200/70 transition-all duration-200 active:scale-[0.99] gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        {publishMutation.isPending ? "Publishing…" : "Uploading files…"}
                                    </>
                                ) : (
                                    <>
                                        <PartyPopper className="w-4 h-4" />
                                        Publish Wish
                                    </>
                                )}
                            </Button>
                            <p className="text-center text-[11px] text-slate-400 mt-3">
                                Files are uploaded in parallel and stored securely on S3
                            </p>
                        </div>

                    </form>
                </Form>
            </div>
        </div>
    );
}