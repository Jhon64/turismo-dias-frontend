import * as Notiflix from 'notiflix';

export const LoadingSpinner = {
    Circle: (text?:string) => {
        Notiflix.Loading.circle(text);
    },
    Remove: () => {
        Notiflix.Loading.remove()
    }
}