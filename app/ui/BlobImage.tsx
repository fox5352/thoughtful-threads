import Image from "next/image";
import { useEffect, useState } from "react";


export default function BlobImage({className="", alt, blob, width, height}:{className: string, alt: string, blob: string, width: number, height: number}) {
    const [objectUrl, setObjectUrl] = useState<string>("/next.svg");

    useEffect(() => {
        
        if (blob && blob.startsWith('data:')) {
            setObjectUrl(blob);
        }
    }, [blob]);

    return (
        <Image
        className={className}
        src={objectUrl}
        alt={alt}
        width={width}
        height={height}
        />
    );
}