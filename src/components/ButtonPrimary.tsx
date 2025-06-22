import { Button } from "antd";

interface ButtonPrimaryProps {
  className?: string;
  property1?: "default" | "DF-hover";
  text: string;
  onClick?: (e: React.MouseEvent) => void;
}

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
  className,
  property1 = "default",
  text,
  onClick,
}) => (
  <Button
    className={`button-primary ${
      property1 === "DF-hover" ? "hover:bg-indigo-600" : ""
    } ${className}`}
    type="primary"
    onClick={onClick}
  >
    <span className="large">{text}</span>
  </Button>
);

export default ButtonPrimary;
