type ElementType = 'h1' | 'h2' | 'h3' | 'h4' | 'p';
type typographyClassObject = {
    [key in ElementType]: string;
};
export const typographyClass: typographyClassObject = {
    h1: 'font-serif scroll-m-20 text-4xl font-semibold tracking-tight lg:text-5xl',
    h2: 'font-serif scroll-m-20 text-3xl font-semibold tracking-tight',
    h3: 'font-serif scroll-m-20 text-2xl font-semibold tracking-tight',
    h4: 'font-serif scroll-m-20 text-xl font-medium tracking-tight',
    p: 'font-sans leading-7',
};
