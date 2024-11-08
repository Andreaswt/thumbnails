"use client";

import { useEffect, useRef, useState } from "react";
import Dropzone from "./dropzone";
import Style from "./style";
import { removeBackground } from "@imgly/background-removal";
import { Button } from "./ui/button";
import { IoMdArrowBack } from "react-icons/io";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { inter, domine } from "../app/fonts";
import { getPresignedUrl } from "~/app/actions/aws";
import { generate, refresh } from "~/app/actions/generate";

const presets = {
  style1: {
    fontSize: 100,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 1)",
    opacity: 1,
  },
  style2: {
    fontSize: 100,
    fontWeight: "bold",
    color: "rgba(0, 0, 0, 1)",
    opacity: 1,
  },
  style3: {
    fontSize: 100,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.8)",
    opacity: 0.8,
  },
};

const ThumbnailCreator = ({ children }: { children: React.ReactNode }) => {
  const [selectedStyle, setSelectedStyle] = useState("style1");
  const [loading, setLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [processedImageSrc, setProcessedImageSrc] = useState<string | null>(
    null,
  );
  const [canvasReady, setCanvasReady] = useState(false);
  const [text, setText] = useState("POV");
  const [font, setFont] = useState("arial");

  const setSelectedImage = async (file?: File) => {
    if (file) {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const src = e.target?.result as string;
        setImageSrc(src);

        const blob = await removeBackground(src);
        const processedUrl = URL.createObjectURL(blob);
        setProcessedImageSrc(processedUrl);
        setCanvasReady(true);
        setLoading(false);
      };
      reader.readAsDataURL(file);
      await generate();
    }
  };

  useEffect(() => {
    if (canvasReady) {
      drawCompositeImage();
    }
  }, [canvasReady]);

  const drawCompositeImage = () => {
    if (!canvasRef.current || !canvasReady || !imageSrc || !processedImageSrc)
      return;

    const canvas = canvasRef.current;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bgImg = new Image();

    bgImg.onload = () => {
      canvas.width = bgImg.width;
      canvas.height = bgImg.height;

      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

      let preset = presets.style1;
      switch (selectedStyle) {
        case "style2":
          preset = presets.style2;
          break;
        case "style3":
          preset = presets.style3;
          break;
      }

      ctx.save();

      // Calculate font size to fill image 90% of the canvas
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      let fontSize = 100;
      let selectFont = "arial";
      switch (font) {
        case "inter":
          selectFont = inter.style.fontFamily;
          break;
        case "domine":
          selectFont = domine.style.fontFamily;
          break;
      }
      ctx.font = `${preset.fontWeight} ${fontSize}px ${selectFont}`;
      const textWidth = ctx.measureText(text).width;
      const targetWidth = canvas.width * 0.9;

      fontSize *= targetWidth / textWidth;
      ctx.font = `${preset.fontWeight} ${fontSize}px ${selectFont}`;

      ctx.fillStyle = preset.color;
      ctx.globalAlpha = preset.opacity;

      const x = canvas.width / 2;
      const y = canvas.height / 2;

      ctx.translate(x, y);
      ctx.fillText(text, 0, 0);
      ctx.restore();

      const fgImg = new Image();
      fgImg.onload = () => {
        ctx.drawImage(fgImg, 0, 0, canvas.width, canvas.height);
      };

      fgImg.src = processedImageSrc;
    };

    bgImg.src = imageSrc;
  };

  const handleDownload = async () => {
    if (canvasRef.current) {
      const link = document.createElement("a");
      link.download = "image.png";
      link.href = canvasRef.current.toDataURL();
      link.click();

      canvasRef.current.toBlob((blob) => {
        if (blob) {
          void (async () => {
            try {
              const uploadUrl = await getPresignedUrl();
              await fetch(uploadUrl, {
                method: "PUT",
                body: blob,
                headers: {
                  "Content-Type": "image/png",
                },
              });
              console.log("File uploaded successfully");
            } catch (error) {
              console.log("Error uploading file");
            }
          })();
        }
      }, "image/png");
    }
  };

  return (
    <>
      {imageSrc ? (
        <>
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-dashed border-gray-800"></div>
            </div>
          ) : (
            <div className="flex w-full max-w-2xl flex-col items-center gap-5">
              <div className="my-4 flex w-full flex-col items-center gap-3">
                <button
                  onClick={async () => {
                    setImageSrc(null);
                    setProcessedImageSrc(null);
                    setCanvasReady(false);
                    await refresh();
                  }}
                  className="flex items-center gap-2 self-start"
                >
                  <IoMdArrowBack className="h-4 w-4" />
                  <p className="leading-7">Go back</p>
                </button>
                <canvas
                  ref={canvasRef}
                  className="max-h-lg h-auto w-full max-w-lg rounded-lg"
                ></canvas>
              </div>
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Edit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="text">Text</Label>
                      <Input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        id="text"
                        placeholder="Text in thumbnail"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="font">Font</Label>
                      <Select
                        value={font}
                        onValueChange={(value) => setFont(value)}
                      >
                        <SelectTrigger id="font">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem value="arial">Arial</SelectItem>
                          <SelectItem value="inter">Inter</SelectItem>
                          <SelectItem value="domine">Domine</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-wrap justify-between gap-2">
                  <Button onClick={() => handleDownload()}>Download</Button>
                  <Button onClick={drawCompositeImage}>Update</Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </>
      ) : (
        <div className="mt-10 flex flex-col">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Hi there
          </h1>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Want to create a thumbnail?
          </h1>
          <p className="mt-2 leading-7 text-muted-foreground">
            Use one of the templates below
          </p>
          <div className="mt-10 flex flex-col items-center justify-between gap-10 md:flex-row md:items-start">
            <Style
              image="/style1.png"
              selectStyle={() => setSelectedStyle("style1")}
              isSelected={selectedStyle === "style1"}
            />
            <Style
              image="/style2.png"
              selectStyle={() => setSelectedStyle("style2")}
              isSelected={selectedStyle === "style2"}
            />
            <Style
              image="/style3.png"
              selectStyle={() => setSelectedStyle("style3")}
              isSelected={selectedStyle === "style3"}
            />
          </div>
          <Dropzone setSelectedImage={setSelectedImage} />
          <div className="mt-8">{children}</div>
        </div>
      )}
    </>
  );
};

export default ThumbnailCreator;
