// poll function
export default function poll(t, i, o = !1, e = 10000, a = 25) {
    e < 0 ||
        (t()
            ? i()
            : setTimeout(() => {
                poll(t, i, o, o ? e : e - a, a);
            }, a));
}