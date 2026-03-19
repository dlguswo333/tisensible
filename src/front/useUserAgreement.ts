import {App as CapacitorApp} from '@capacitor/app';
import {Dialog} from '@capacitor/dialog';
import {useAtom} from 'jotai';
import {atomWithDefault} from 'jotai/utils';
import {useCallback, useEffect} from 'react';
import z from 'zod';

const userAgreementType = z.boolean();

const USER_AGREEMENT_STORE_KEY = 'userAgreement';

const userAgreementAtom = atomWithDefault<z.infer<typeof userAgreementType>>(() => {
  const valueFromStore = localStorage.getItem(USER_AGREEMENT_STORE_KEY);
  return !!valueFromStore;
});

const useUserAgreement = (showDialog: boolean) => {
  const [userAgreement, rawSetUserAgreement] = useAtom(userAgreementAtom);

  const setUserAgreement = useCallback(
    (value: boolean) => {
      const parseResult = userAgreementType.safeParse(value);
      if (parseResult.success) {
        rawSetUserAgreement(parseResult.data);
        localStorage.setItem(USER_AGREEMENT_STORE_KEY, JSON.stringify(parseResult.data));
      }
    },
    [rawSetUserAgreement],
  );

  useEffect(() => {
    const callback = async () => {
      if (!showDialog || userAgreement) {
        return;
      }
      const {value} = await Dialog.confirm({
        title: 'Warning',
        message:
          'tiSensible does not guarantee 100% accuracy of data. It should not be used for critical or safety-related purposes. You should be aware of this and use tiSensible at your own risk.',
        okButtonTitle: 'I Agree',
        cancelButtonTitle: 'Exit App',
      });
      if (value) {
        setUserAgreement(true);
      } else {
        CapacitorApp.exitApp();
      }
    };
    callback();
  }, [setUserAgreement, userAgreement, showDialog]);

  return userAgreement;
};

export default useUserAgreement;
