export function cancelSubscription(arr: Array<any>): void {
    arr.forEach((element) => {
        if (element) {
            element.unsubscribe();
        }
    });
}
