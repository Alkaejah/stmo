import React from "react";
import { Button } from "../ui/Button";

type Props = {
  onClose?: () => void;
  positive?: string;
  negative?: string;
  isPending: boolean;
  isSubmit?: boolean;
  buttonFn: Function;
};

const ModalContainerFooter = ({
  positive,
  negative,
  onClose,
  isPending,
  isSubmit,
  buttonFn,
}: Props) => {
  return (
    <div className="flex justify-between px-6 pb-4">
      <Button variant="ghost" type="button" onClick={onClose}>
        {negative}
      </Button>
      <Button
        type={isSubmit ? "submit" : "button"}
        onClick={() => (isSubmit ? null : buttonFn())}
      >
        {isPending === true ? (
          <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent text-blue-500 rounded-full">
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          positive
        )}
      </Button>
    </div>
  );
};

export default ModalContainerFooter;
